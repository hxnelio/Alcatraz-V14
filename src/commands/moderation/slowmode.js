const Command = require('../Alcatraz.js');
const { EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { oneLine, stripIndent } = require('common-tags');

module.exports = class SlowmodeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'slowmode',
      aliases: ['slow', 'sm'],
      usage: 'slowmode [#salon/ID] <temps> [raison]',
      description: oneLine`
        Active le mode lent dans un salon avec le taux spécifié.
        Si aucun salon n'est fourni, le mode lent affectera le salon actuel.
        Fournissez un taux de 0 pour désactiver.      `,
      type: client.types.MOD,
      clientPermissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.ManageChannels],
      userPermissions: [PermissionFlagsBits.ManageChannels],
      examples: ['slowmode #salon 2', 'slowmode 3']
    });
  }
  async run(message, args) {
    let index = 1;
    let channel = this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (!channel) {
      channel = message.channel;
      index--;
    }

    if (channel.type != ChannelType.GuildText || !channel.viewable) return this.sendErrorMessage(message, 0, stripIndent`
      Veuillez mentionner un salon de texte accessible ou fournir un ID de salon de texte valide
    `);
      
    const rate = args[index];
    if (!rate || rate < 0 || rate > 59) return this.sendErrorMessage(message, 0, stripIndent`
      Veuillez indiquer une limite de débit comprise entre 0 et 59 secondes
    `);

    if (!channel.permissionsFor(message.guild.members.me).has([PermissionFlagsBits.ManageChannels]))
      return this.sendErrorMessage(message, 0, 'Je n\'ai pas l\'autorisation de gérer la chaîne fournie');

    let reason = args.slice(index + 1).join(' ');
    if (!reason) reason = '`Aucune raison fourni`';
    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';
    
    await channel.setRateLimitPerUser(rate, reason);
    const status = (channel.rateLimitPerUser) ? 'activé' : 'désactivé';
    const embed = new EmbedBuilder()
      .setTitle('Commande Slowmode')
      .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
      .setTimestamp()
      .setColor(0x2f3136);

    if (rate === '0') {
      message.channel.send({
        embeds: [embed
          .setDescription(`\`${status}\` ➔ \`désactivé\``)
          .addFields(
            { name: 'Par', value: message.member.toString(), inline: true },
            { name: 'Salon', value: channel.toString(), inline: true },
            { name: 'Raison', value: reason }
          )]
      });
    
    } else {

      message.channel.send({
        embeds: [embed
          .setDescription(`\`${status}\` ➔ \`activé\``)
          .addFields(
            { name: 'Par', value: message.member.toString(), inline: true },
            { name: 'Salon', value: channel.toString(), inline: true },
            { name: 'Temps', value: `\`${rate}\` seconde(s)`, inline: true },
            { name: 'Raison', value: reason }
          )]
      });
    }

    this.sendModLogMessage(message, reason, { Channel: channel, Rate: `\`${rate}\`` });
  }
};