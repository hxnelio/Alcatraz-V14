const Command = require('../Alcatraz.js');
const { EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { oneLine } = require('common-tags');
const { success } = require('../../utils/emojis.json');

module.exports = class SetWelcomeChannelCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setwelcomechannel',
      aliases: ['setwc', 'swc'],
      usage: 'setwelcomechannel <channel mention/ID>',
      description: oneLine`
        Définit le canal de texte du message de bienvenue pour votre serveur.
        Ne fournissez aucun canal pour effacer le courant \`welcome channel\`.
        un \`welcome message\` doit également être configuré pour activer les messages de bienvenue.
      `,
      type: client.types.ADMIN,
      userPermissions: [PermissionFlagsBits.ManageGuild],
      examples: ['setwelcomechannel #general']
    });
  }
  run(message, args) {

    let { welcome_channel_id: welcomeChannelId, welcome_message: welcomeMessage } = 
      message.client.db.settings.selectWelcomes.get(message.guild.id);
    const oldWelcomeChannel = message.guild.channels.cache.get(welcomeChannelId) || '`Aucun`';
    const oldStatus = message.client.utils.getStatus(welcomeChannelId, welcomeMessage);

    if (welcomeMessage) {
      if (welcomeMessage.length >= 1018) welcomeMessage = welcomeMessage.slice(0, 1015) + '...';
      welcomeMessage = `\`\`\`${welcomeMessage}\`\`\``;
    }
    
    const embed = new EmbedBuilder()
      .setTitle('Paramètres: `Welcome Messages`')
      .setDescription(`Le \`salon de bienvenue\` a été mis à jour avec succès. ${success}`)
      .addFields({ name: 'Message', value: welcomeMessage || '`Aucun`' })
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
      .setTimestamp()
      .setColor(0x2f3136);

    if (args.length === 0) {
      message.client.db.settings.updateWelcomeChannelId.run(null, message.guild.id);

      const status = 'non actif';
      const statusUpdate = (oldStatus != status) ? `\`${oldStatus}\` ➔ \`${status}\`` : `\`${oldStatus}\``; 
      
      return message.channel.send({ embeds: [embed
        .spliceFields(0, 0, { name: 'Salon', value: `${oldWelcomeChannel} ➔ \`Aucun\``, inline: true })
        .spliceFields(1, 0, { name: 'Statut', value: statusUpdate, inline: true })
      ] });
    }

    const welcomeChannel = this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (!welcomeChannel || welcomeChannel.type != ChannelType.GuildText || !welcomeChannel.viewable)
      return this.sendErrorMessage(message, `
      Argument invalide. Veuillez mentionner une chaîne de texte accessible ou fournir un identifiant de chaîne valide.
      `);

    const status =  message.client.utils.getStatus(welcomeChannel, welcomeMessage);
    const statusUpdate = (oldStatus != status) ? `\`${oldStatus}\` ➔ \`${status}\`` : `\`${oldStatus}\``;

    message.client.db.settings.updateWelcomeChannelId.run(welcomeChannel.id, message.guild.id);
    message.channel.send({ embeds: [embed
      .spliceFields(0, 0, { name: 'Salon', value: `${oldWelcomeChannel} ➔ ${welcomeChannel}`, inline: true})
      .spliceFields(1, 0, { name: 'Statut', value: statusUpdate, inline: true})
    ] });
  }
};