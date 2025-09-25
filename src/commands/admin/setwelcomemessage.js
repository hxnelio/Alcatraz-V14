const Command = require('../Alcatraz.js');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { success } = require('../../utils/emojis.json');
const { oneLine } = require('common-tags');

module.exports = class SetWelcomeMessageCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setwelcomemessage',
      aliases: ['setwelcomemsg', 'setwm', 'swm'],
      usage: 'setwelcomemessage <message>',
      description: oneLine`
        Définit le message que Alcatraz dira lorsque quelqu'un rejoint votre serveur.
        Vous pouvez utiliser \`?member\` pour remplacer une mention d'utilisateur,
         \`?username\` pour remplacer le nom d'utilisateur de quelqu'un,
        \`?tag\` pour remplacer la balise Discord complète de quelqu'un (nom d'utilisateur + discriminateur),
        et \`?size\` pour remplacer le nombre de membres actuel de votre serveur.
        N'entrez aucun message pour effacer le \`message de bienvenue\` actuel.
        Un \`salon de bienvenue\` doit également être défini pour activer les messages de bienvenue.`,
      type: client.types.ADMIN,
      userPermissions: [PermissionFlagsBits.ManageGuild],
      examples: ['setwelcomemessage ?member viens de nous rejoindre!']
    });
  }
  run(message, args) {

    const { welcome_channel_id: welcomeChannelId, welcome_message: oldWelcomeMessage } = 
      message.client.db.settings.selectWelcomes.get(message.guild.id);
    let welcomeChannel = message.guild.channels.cache.get(welcomeChannelId);

    const oldStatus = message.client.utils.getStatus(welcomeChannelId, oldWelcomeMessage);

    const embed = new EmbedBuilder()
      .setTitle('Paramètres: `Bienvenue`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`Le \`message de bienvenue\` a été mis à jour avec succès. ${success}`)
      .addFields({ name: 'Salon', value: welcomeChannel || '`Aucun`', inline: true })
      .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
      .setTimestamp()
      .setColor(0x2f3136);

    if (!args[0]) {
      message.client.db.settings.updateWelcomeMessage.run(null, message.guild.id);

      const status = 'désactivé';
      const statusUpdate = (oldStatus != status) ? `\`${oldStatus}\` ➔ \`${status}\`` : `\`${oldStatus}\``; 

      return message.channel.send({ embeds: [embed
        .addFields(
          { name: 'Statut', value: statusUpdate, inline: true },
          { name: 'Message', value: '`Aucun`' }
        )
      ] });
    }
    
    let welcomeMessage = message.content.slice(message.content.indexOf(args[0]), message.content.length);
    message.client.db.settings.updateWelcomeMessage.run(welcomeMessage, message.guild.id);
    if (welcomeMessage.length > 1024) welcomeMessage = welcomeMessage.slice(0, 1021) + '...';

    const status =  message.client.utils.getStatus(welcomeChannel, welcomeMessage);
    const statusUpdate = (oldStatus != status) ? `\`${oldStatus}\` ➔ \`${status}\`` : `\`${oldStatus}\``;

    message.channel.send({ embeds: [embed
      .addFields(
        { name: 'Statut', value: statusUpdate, inline: true },
        { name: 'Message', value: message.client.utils.replaceKeywords(welcomeMessage) }
      )
    ] });
  }
};