const Command = require('../Alcatraz.js');
const { EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { oneLine, stripIndent } = require('common-tags');

module.exports = class PurgeBotCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'purgebot',
      aliases: ['clearbot'],
      usage: 'purgebot [#salon/ID] <Nombre de message> [raison]',
      description: oneLine`
        Passe au crible le nombre spécifié de messages dans le salon fourni
        et supprime toutes les commandes et tous les messages d'Alcatraz.
        Si aucun salon n'est indiqué, les messages seront supprimés du salon actuel.
        Pas plus de 100 messages peuvent être passés au crible à la fois.
        Les messages datant de plus de 2 semaines ne peuvent pas être supprimés.`,
      type: client.types.MOD,
      clientPermissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.ManageMessages],
      userPermissions: [PermissionFlagsBits.ManageMessages],
      examples: ['purgebot 20']
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

    const amount = parseInt(args[0]);
    if (isNaN(amount) === true || !amount || amount < 0 || amount > 100)
      return this.sendErrorMessage(message, 0, 'Veuillez fournir un nombre de messages compris entre 1 et 100');

    if (!channel.permissionsFor(message.guild.members.me).has([PermissionFlagsBits.ManageMessages]))
      return this.sendErrorMessage(message, 0, 'Je n\'ai pas l\'autorisation de gérer les messages dans le salon fourni');

    let reason = args.slice(1).join(' ');
    if (!reason) reason = '`Aucune raison fourni`';
    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';
    
    const prefix = message.client.db.settings.selectPrefix.pluck().get(message.guild.id);

    await message.delete();

    let messages = (await message.channel.messages.fetch({limit: amount})).filter(msg => { 
      const cmd = msg.content.trim().split(/ +/g).shift().slice(prefix.length).toLowerCase();
      const command = message.client.commands.get(cmd) || message.client.aliases.get(cmd);
      if (msg.author.bot || command) return true;
    });

    if (messages.size === 0) { 

      message.channel.send({
        embeds: [new EmbedBuilder()
          .setTitle('Commande purgebot')
          .setDescription(`
            Impossible de trouver des messages ou des commandes de bot.
            Ce message sera supprimé après \`10 secondes\`.
          `)
          .addFields(
            { name: 'salon', value: channel.toString(), inline: true },
            { name: 'Messages trouvés', value: `\`${messages.size}\``, inline: true }
          )
          .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
          .setTimestamp()
          .setColor(0x2f3136)]
      }).then(msg => setTimeout(() => msg.delete().catch(() => {}), 10000)).catch(err => message.client.logger.error(err.stack));

    } else { 
      
      channel.bulkDelete(messages, true).then(msgs => { 
        const embed = new EmbedBuilder()
          .setTitle('Commande purgebot')
          .setDescription(`
            Supprimé avec succès **${msgs.size}** message(s). 
            Ce message sera supprimé après \`10 secondes\`.
          `)
          .addFields(
            { name: 'salon', value: channel.toString(), inline: true },
            { name: 'Messages trouvés', value: `\`${msgs.size}\``, inline: true },
            { name: 'Raison', value: reason }
          )
          .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
          .setTimestamp()
          .setColor(0x2f3136);

        message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete().catch(() => {}), 10000))
          .catch(err => message.client.logger.error(err.stack));
      });
    }
    
    this.sendModLogMessage(message, reason, { Channel: channel, 'Messages trouvés': `\`${messages.size}\`` });
  }
};