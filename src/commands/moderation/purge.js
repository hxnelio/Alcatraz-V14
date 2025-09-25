const Command = require('../Alcatraz.js');
const { EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { oneLine, stripIndent } = require('common-tags');

module.exports = class PurgeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'purge',
      aliases: ['clear'],
      usage: 'purge [channel mention/ID] [user mention/ID] <message count> [reason]',
      description: oneLine`
        Supprime la quantité spécifiée de messages du salon fourni.
        Si aucun salon n'est indiqué, les messages seront supprimés du salon actuel.
        Si un membre est fourni, seuls ses messages seront supprimés du lot.
        Pas plus de 100 messages peuvent être supprimés à la fois.
        Les messages datant de plus de 2 semaines ne peuvent pas être supprimés.`,
      type: client.types.MOD,
      clientPermissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.ManageMessages],
      userPermissions: [PermissionFlagsBits.ManageMessages],
      examples: ['purge 20', 'purge #salon 10', 'purge @GalackQSM 50', 'purge #salon @GalackQSM 5']
    });
  }
  async run(message, args) {

    let channel = this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (channel) {
      args.shift();
    } else channel = message.channel;

    if (channel.type != ChannelType.GuildText || !channel.viewable) return this.sendErrorMessage(message, 0, stripIndent`
      Veuillez mentionner un salon de texte accessible ou fournir un ID de salon de texte valide
    `);

    let member = this.getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);
    if (member) {
      args.shift();
    }

    const amount = parseInt(args[0]);
    if (isNaN(amount) === true || !amount || amount < 0 || amount > 100)
      return this.sendErrorMessage(message, 0, 'Veuillez fournir un nombre de messages compris entre 1 et 100');

    if (!channel.permissionsFor(message.guild.members.me).has([PermissionFlagsBits.ManageMessages]))
      return this.sendErrorMessage(message, 0, 'Je n\'ai pas l\'autorisation de gérer les messages dans le salon fourni');

    let reason = args.slice(1).join(' ');
    if (!reason) reason = '`Aucune raison fourni`';
    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';

    await message.delete();

    let messages;
    if (member) {
      messages = (await channel.messages.fetch({ limit: amount })).filter(m => m.member.id === member.id);
    } else messages = amount;

    if (messages.size === 0) {

      message.channel.send({
        embeds: [new EmbedBuilder()
          .setTitle('Commande purge éffectuer')
          .setDescription(`
            Impossible de trouver les messages de ${member}. 
            Ce message sera supprimé après \`10 secondes\`.
          `)
          .addFields(
            { name: 'Salon', value: channel.toString(), inline: true },
            { name: 'Membre', value: member.toString() },
            { name: 'Messages trouvés', value: `\`${messages.size}\``, inline: true }
          )
          .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
          .setTimestamp()
          .setColor(0x2f3136)]
      }).then(msg => setTimeout(() => msg.delete().catch(() => {}), 10000)).catch(err => message.client.logger.error(err.stack));

    } else {

      channel.bulkDelete(messages, true).then(messages => {
        const embed = new EmbedBuilder()
          .setTitle('Commande purge éffectuer')
          .setDescription(`
            Supprimé avec succès **${messages.size}** message(s). 
            Ce message sera supprimé après \`10 secondes\`.
          `)
          .addFields(
            { name: 'Salon', value: channel.toString(), inline: true },
            { name: 'Nombre de messages', value: `\`${messages.size}\``, inline: true },
            { name: 'Raison', value: reason }
          )
          .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
          .setTimestamp()
          .setColor(0x2f3136);
    
        if (member) {
          embed
            .spliceFields(1, 1, { name: 'Messages trouvés', value:  `\`${messages.size}\``, inline: true})
            .spliceFields(1, 0, { name: 'Membre', value: member.toString(), inline: true});
        }

        message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete().catch(() => {}), 10000))
          .catch(err => message.client.logger.error(err.stack));
      });
    }
    
    const fields = { 
      Channel: channel
    };

    if (member) {
      fields['Membre'] = member;
      fields['Messages trouvés'] = `\`${messages.size}\``;
    } else fields['Nombre de messages'] = `\`${amount}\``;

    this.sendModLogMessage(message, reason, fields);

  }
};