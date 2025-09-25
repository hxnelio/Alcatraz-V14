const Command = require('../Alcatraz.js');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { oneLine } = require('common-tags');

module.exports = class SetCrownMessageCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setcrownmessage',
      aliases: ['setcm', 'scm'],
      usage: 'setcrownmessage <message>',
      description: oneLine`
        Définit le message que Alcatraz prononcera lors de la rotation des rôles de la couronne.
        Vous pouvez utiliser \`?member\` pour remplacer une mention d'utilisateur et \`?role\` pour remplacer le rôle de la couronne.
        N'entrez aucun message pour effacer le \`message de la couronne\`.
        le \`message de la couronne\` ne sera envoyé que si un \`salon de couronne\`, \`rôle de la couronne\`, et \`calendrier de la couronne\` sont fixés.
      `,
      type: client.types.ADMIN,
      userPermissions: [PermissionFlagsBits.ManageGuild],
      examples: ['setcrownmessage ?member a remporté le ?role!']
    });
  }
  run(message, args) {
    const { 
      crown_role_id: crownRoleId, 
      crown_channel_id: crownChannelId, 
      crown_schedule: crownSchedule 
    } = message.client.db.settings.selectCrown.get(message.guild.id);
    const crownRole = message.guild.roles.cache.get(crownRoleId);
    const crownChannel = message.guild.channels.cache.get(crownChannelId);

    const status = message.client.utils.getStatus(crownRoleId, crownSchedule);

    const embed = new EmbedBuilder()
      .setTitle('Paramètres: `Système de couronne`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription('Le `crown message` a été mis à jour avec succès. ✅') 
      .addFields(
        { name: 'Rôle', value: crownRole || '`Aucun`', inline: true },
        { name: 'Salon', value: crownChannel || '`Aucun`', inline: true },
        { name: 'Calendrier', value: `\`${(crownSchedule) ? crownSchedule : 'Aucun'}\``, inline: true },
        { name: 'Statut', value: `\`${status}\`` }
      )
      .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
      .setTimestamp()
      .setColor(0x2f3136);

    if (!args[0]) {
      message.client.db.settings.updateCrownMessage.run(null, message.guild.id);
      return message.channel.send({ embeds: [embed.addFields({ name: 'Message', value: '`Aucun`' })] });
    }

    let crownMessage = message.content.slice(message.content.indexOf(args[0]), message.content.length);
    message.client.db.settings.updateCrownMessage.run(crownMessage, message.guild.id);
    if (crownMessage.length >= 1018) crownMessage = crownMessage.slice(0, 1015) + '...';
    message.channel.send({ embeds: [embed.addFields({ name: 'Message', value: `\`\`\`${crownMessage}\`\`\`` })] });
  }
};