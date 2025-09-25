const Command = require('../Alcatraz.js');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { oneLine } = require('common-tags');

module.exports = class SetCrownRoleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setcrownrole',
      aliases: ['setcr', 'scr'],
      usage: 'setcrownrole <role mention/ID>',
      description: oneLine`
        Définit le rôle que Alcatraz donnera au membre avec le plus de points à chaque cycle.
        Ne donnez aucun rôle pour effacer le courant \`rôle de la couronne\`.
        un \`calendrier de la couronne\` doit également être défini pour activer la rotation des rôles.
      `,
      type: client.types.ADMIN,
      userPermissions: [PermissionFlagsBits.ManageGuild],
      examples: ['setcrownrole @Crown']
    });
  }
  run(message, args) {
    let { 
      crown_role_id: crownRoleId, 
      crown_channel_id: crownChannelId, 
      crown_message: crownMessage, 
      crown_schedule: crownSchedule 
    } = message.client.db.settings.selectCrown.get(message.guild.id);
    const oldCrownRole = message.guild.roles.cache.get(crownRoleId) || '`Aucun`';
    const crownChannel = message.guild.channels.cache.get(crownChannelId);

    const oldStatus = message.client.utils.getStatus(crownRoleId, crownSchedule);

    if (crownMessage) {
      if (crownMessage.length >= 1018) crownMessage = crownMessage.slice(0, 1015) + '...';
      crownMessage = `\`\`\`${crownMessage}\`\`\``;
    }

    const embed = new EmbedBuilder()
      .setTitle('Paramètres: `Système de couronne`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription('Le `rôle de la couronne` a été mis à jour avec succès. ✅')
      .addFields(
        { name: 'Salon', value: crownChannel || '`Aucun`', inline: true },
        { name: 'Calendrier', value: `\`${(crownSchedule) ? crownSchedule : 'Aucun'}\``, inline: true },
        { name: 'Message', value: crownMessage || '`Aucun`' }
      )
      .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
      .setTimestamp()
      .setColor(0x2f3136);

    if (args.length === 0) {
      message.client.db.settings.updateCrownRoleId.run(null, message.guild.id);
      if (message.guild.job) message.guild.job.cancel(); // Cancel old job
      
      const status = 'non actif';
      const statusUpdate = (oldStatus != status) ? `\`${oldStatus}\` ➔ \`${status}\`` : `\`${oldStatus}\``; 

      return message.channel.send({ embeds: [embed
        .spliceFields(0, 0, { name: 'Rôle', value: `${oldCrownRole} ➔ \`Aucun\``, inline: true })
        .spliceFields(3, 0, { name: 'Statut', value: statusUpdate })
      ] });
    }

    const crownRole = this.getRoleFromMention(message, args[0]) || message.guild.roles.cache.get(args[0]);
    if (!crownRole)
      return this.sendErrorMessage(message, 'Argument invalide. Veuillez mentionner un rôle ou fournir un identifiant de rôle.');
    message.client.db.settings.updateCrownRoleId.run(crownRole.id, message.guild.id);

    const status =  message.client.utils.getStatus(crownRole, crownSchedule);
    const statusUpdate = (oldStatus != status) ? `\`${oldStatus}\` ➔ \`${status}\`` : `\`${oldStatus}\``;

    message.channel.send({ embeds: [embed
      .spliceFields(0, 0, { name: 'Rôle', value: `${oldCrownRole} ➔ ${crownRole}`, inline: true })
      .spliceFields(3, 0, { name: 'Statut', value: statusUpdate })
    ] });

    message.client.utils.scheduleCrown(message.client, message.guild);
  }
};