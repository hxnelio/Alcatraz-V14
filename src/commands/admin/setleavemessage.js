const Command = require('../Alcatraz.js');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { success } = require('../../utils/emojis.json');
const { oneLine } = require('common-tags');

module.exports = class SetFarewellMessageCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setleavemessage',
      aliases: ['setbye'],
      usage: 'setleavemessage <message>',
      description: oneLine`
        Définit le message que Alcatraz prononcera lorsque quelqu'un quittera votre serveur.
        Vous pouvez utiliser \`?member\` pour remplacer une mention d'utilisateur,
        \`?username\` pour remplacer le nom d'utilisateur de quelqu'un,
        \`?tag\` pour remplacer la balise Discord complète de quelqu'un (nom d'utilisateur + discriminateur),
        et \`?size\` pour remplacer le nombre de membres actuel de votre serveur.
        N'entrez aucun message pour effacer le \`message d'adieu\` actuel.
        Un «canal d'adieu» doit également être défini pour activer les messages d'adieu.
      `,
      type: client.types.ADMIN,
      userPermissions: [PermissionFlagsBits.ManageGuild],
      examples: ['setleavemessage ?member viens de nous quitter.']
    });
  }
  run(message, args) {

    const { farewell_channel_id: farewellChannelId, farewell_message: oldFarewellMessage } = 
      message.client.db.settings.selectFarewells.get(message.guild.id);
    const farewellChannel = message.guild.channels.cache.get(farewellChannelId);
    
    const oldStatus = message.client.utils.getStatus(farewellChannelId, oldFarewellMessage);

    const embed = new EmbedBuilder()
      .setTitle('Paramètres: `Au revoir`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`Le \`message d'au revoir\` a été mis à jour avec succès. ${success}`)
      .addFields({ name: 'Salon', value: farewellChannel || '`Aucun`', inline: true })
      .setFooter({ text: message.member.displayName, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
      .setTimestamp()
      .setColor(message.guild.members.me.displayHexColor);

    if (!args[0]) {
      message.client.db.settings.updateFarewellMessage.run(null, message.guild.id);

      const status = 'désactivé';
      const statusUpdate = (oldStatus != status) ? `\`${oldStatus}\` ➔ \`${status}\`` : `\`${oldStatus}\``; 

      return message.channel.send({ embeds: [embed
        .addFields(
          { name: 'Statut', value: statusUpdate, inline: true },
          { name: 'Message', value: '`Aucun`' }
        )
      ] });
    }
    
    let farewellMessage = message.content.slice(message.content.indexOf(args[0]), message.content.length);
    message.client.db.settings.updateFarewellMessage.run(farewellMessage, message.guild.id);
    if (farewellMessage.length > 1024) farewellMessage = farewellMessage.slice(0, 1021) + '...';

    const status =  message.client.utils.getStatus(farewellChannel, farewellMessage);
    const statusUpdate = (oldStatus != status) ? `\`${oldStatus}\` ➔ \`${status}\`` : `\`${oldStatus}\``;
    
    message.channel.send({ embeds: [embed
      .addFields(
        { name: 'Statut', value: statusUpdate, inline: true },
        { name: 'Message', value: message.client.utils.replaceKeywords(farewellMessage) }
      )
    ] });
  }
};