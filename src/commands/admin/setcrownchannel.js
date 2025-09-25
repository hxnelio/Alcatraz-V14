const Command = require('../Alcatraz.js');
const { EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { oneLine } = require('common-tags');

module.exports = class SetCrownChannelCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setcrownchannel',
      aliases: ['setcc', 'scc'],
      usage: 'setcrownchannel <#salon/ID>',
      description: oneLine`
      Définit le canal de texte du message de la couronne pour votre serveur.
      Ne fournissez aucun canal pour effacer le courant \`crown channel\`.
        un \`crown message\` ne sera envoyé que si un \`crown channel\`, \`crown rôle\`, et \`crown schedule\` sont fixés.
      `,
      type: client.types.ADMIN,
      userPermissions: [PermissionFlagsBits.ManageGuild],
      examples: ['setcrownchannel #general']
    });
  }
  run(message, args) {
    let { 
      crown_role_id: crownRoleId, 
      crown_channel_id: crownChannelId, 
      crown_message: crownMessage, 
      crown_schedule: crownSchedule 
    } = message.client.db.settings.selectCrown.get(message.guild.id);
    const crownRole = message.guild.roles.cache.get(crownRoleId);
    const oldCrownChannel = message.guild.channels.cache.get(crownChannelId) || '`Aucun`';

    const status = message.client.utils.getStatus(crownRoleId, crownSchedule);
    
    if (crownMessage) {
      if (crownMessage.length >= 1018) crownMessage = crownMessage.slice(0, 1015) + '...';
      crownMessage = `\`\`\`${crownMessage}\`\`\``;
    }

    const embed = new EmbedBuilder()
      .setTitle('Settings: `Crown System`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription('Le `rôle crown` a été mis à jour avec succès. ✅')
      .addFields(
        { name: 'Rôle', value: crownRole || '`Aucun`', inline: true },
        { name: 'Schedule', value: `\`${(crownSchedule) ? crownSchedule : 'Aucun'}\``, inline: true },
        { name: 'Statut', value: `\`${status}\`` },
        { name: 'Message', value: crownMessage || '`Aucun`' }
      )
      .setFooter({ text: message.member.displayName, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
      .setTimestamp()
      .setColor(message.guild.members.me.displayHexColor);

    if (args.length === 0) {
      message.client.db.settings.updateCrownChannelId.run(null, message.guild.id);
      return message.channel.send({ embeds: [embed.spliceFields(1, 0, { 
        name: 'Channel', 
        value: `${oldCrownChannel} ➔ \`Aucun\``, 
        inline: true
      })] });
    }

    const crownChannel = this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (!crownChannel || crownChannel.type != ChannelType.GuildText || !crownChannel.viewable) return this.sendErrorMessage(message, `
    Argument invalide. Veuillez mentionner un salon de texte accessible ou fournir un identifiant de salon valide.
    `);

    message.client.db.settings.updateCrownChannelId.run(crownChannel.id, message.guild.id);
    message.channel.send({ embeds: [embed.spliceFields(1, 0, { 
      name: 'Channel', 
      value: `${oldCrownChannel} ➔ ${crownChannel}`, 
      inline: true 
    })] });
  }
};