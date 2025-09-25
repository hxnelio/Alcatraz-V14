const Command = require('../Alcatraz.js');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { stripIndent, oneLine } = require('common-tags');

module.exports = class SettingsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'settings',
      aliases: ['setting', 'set', 's', 'config', 'conf'],
      usage: 'settings [category]',
      description: oneLine`
        Affiche tous les paramètres actuels de votre serveur.
        Si une catégorie est fournie, seuls les paramètres qui lui appartiennent seront affichés.
      `,
      type: client.types.ADMIN,
      userPermissions: [PermissionFlagsBits.ManageGuild],
      examples: ['settings System']
    });
  }
  run(message, args) {

    const row = message.client.db.settings.selectRow.get(message.guild.id);
    const prefix = `\`${row.prefix}\``;
    const systemChannel = message.guild.channels.cache.get(row.system_channel_id) || '`Aucun`';
    const modlogChannel = message.guild.channels.cache.get(row.modlog_channel_id) || '`Aucun`';
    const verificationChannel = message.guild.channels.cache.get(row.verification_channel_id) || '`Aucun`';
    const welcomeChannel = message.guild.channels.cache.get(row.welcome_channel_id) || '`Aucun`';
    const leaveChannel = message.guild.channels.cache.get(row.leave_channel_id) || '`Aucun`';
    const crownChannel = message.guild.channels.cache.get(row.crown_channel_id) || '`Aucun`';
    const adminRole = message.guild.roles.cache.get(row.admin_role_id) || '`Aucun`';
    const modRole = message.guild.roles.cache.get(row.mod_role_id) || '`Aucun`';
    const muteRole = message.guild.roles.cache.get(row.mute_role_id) || '`Aucun`';
    const autoRole = message.guild.roles.cache.get(row.auto_role_id) || '`Aucun`';
    const verificationRole = message.guild.roles.cache.get(row.verification_role_id) || '`Aucun`';
    const crownRole = message.guild.roles.cache.get(row.crown_role_id) || '`Aucun`';
    const autoKick = (row.auto_kick) ? `Après \`${row.auto_kick}\` avertisement(s)` : '`désactivé`';
    const messagePoints = `\`${row.message_points}\``;
    const commandPoints = `\`${row.command_points}\``;
    const voicePoints = `\`${row.voice_points}\``;
    let verificationMessage = row.verification_message || '`Aucun`';
    let welcomeMessage = row.welcome_message || '`Aucun`';
    let leaveMessage = row.leave_message|| '`Aucun`';
    let crownMessage = row.crown_message || '`Aucun`';
    const crownSchedule = (row.crown_schedule) ? `\`${row.crown_schedule}\`` : '`Aucun`';
    let disabledCommands = '`Aucune`';
    if (row.disabled_commands) 
      disabledCommands = row.disabled_commands.split(' ').map(c => `\`${c}\``).join(' ');

    const verificationStatus = `\`${message.client.utils.getStatus(
      row.verification_role_id && row.verification_channel_id && row.verification_message
    )}\``;
    const randomColor = `\`${message.client.utils.getStatus(row.random_color)}\``;
    const welcomeStatus = `\`${message.client.utils.getStatus(row.welcome_message && row.welcome_channel_id)}\``;
    const leaveStatus = `\`${message.client.utils.getStatus(row.leave_message && row.leave_channel_id)}\``;
    const pointsStatus = `\`${message.client.utils.getStatus(row.point_tracking)}\``;
    const crownStatus = `\`${message.client.utils.getStatus(row.crown_role && row.crown_schedule)}\``;
    
    let setting = args.join().toLowerCase();
    if (setting.endsWith('setting')) setting = setting.slice(0, -7);
    const embed = new EmbedBuilder()
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
      .setTimestamp()
      .setColor(0x2f3136);
    switch (setting) {
      case 'system':
        return message.channel.send({ embeds: [embed
          .setTitle('Paramètres: `Système`')
          .addFields(
            { name: 'Préfix', value: prefix, inline: true },
            { name: 'Salon système', value: systemChannel, inline: true },
            { name: 'Salon Modlog', value: modlogChannel, inline: true },
            { name: 'Rôle Administrateur', value: adminRole, inline: true },
            { name: 'Rôle Modérateur', value: modRole, inline: true },
            { name: 'Rôle Mute', value: muteRole, inline: true },
            { name: 'Rôle Auto', value: autoRole, inline: true },
            { name: 'Auto Kick', value: autoKick, inline: true },
            { name: 'Couleur aléatoire', value: randomColor, inline: true }
          )
        ] });
      case 'welcome':
      case 'welcomemessages':
        if (welcomeMessage != '`Aucun`') welcomeMessage = `\`\`\`${welcomeMessage}\`\`\``;
        embed
          .setTitle('Paramètres: `Messages de bienvenue`')
          .addFields(
            { name: 'Salon', value: welcomeChannel, inline: true },
            { name: 'Statut', value: welcomeStatus, inline: true }
          );
        if (welcomeMessage.length > 1024) embed
          .setDescription(welcomeMessage)
          .addFields({ name: 'Message', value: 'Message situé au-dessus en raison des limites de caractères.' });
        else embed.addFields({ name: 'Message', value: welcomeMessage });
        return message.channel.send({ embeds: [embed] });
      case 'leave':
      case 'leavemessages':
        if (leaveMessage != '`Aucun`') leaveMessage = `\`\`\`${leaveMessage}\`\`\``;
        embed
          .setTitle('Paramètres: `Messages d\'au revoir`')
          .addFields(
            { name: 'Salon', value: leaveChannel, inline: true },
            { name: 'Statut', value: leaveStatus, inline: true }
          );
        if (leaveMessage.length > 1024) embed
          .setDescription(leaveMessage)
          .addFields({ name: 'Message', value: 'Message situé au-dessus en raison des limites de caractères.' });
        else embed.addFields({ name: 'Message', value: leaveMessage });
        return message.channel.send({ embeds: [embed] });
      case 'points':
      case 'pointssystem':
        return message.channel.send({ embeds: [embed
          .setTitle('Paramètres: `Système de points`')
          .addFields(
            { name: 'Points de message', value: messagePoints, inline: true },
            { name: 'Points de commande', value: commandPoints, inline: true },
            { name: 'Points de vocal', value: voicePoints, inline: true },
            { name: 'Statut', value: pointsStatus }
          )
        ] });
      case 'crown':
      case 'crownsystem':
        if (crownMessage != '`Aucun`') crownMessage = `\`\`\`${crownMessage}\`\`\``;
        embed
          .setTitle('Paramètres: `Système de couronne`')
          .addFields(
            { name: 'Rôle', value: crownRole, inline: true },
            { name: 'Salon', value: crownChannel, inline: true },
            { name: 'Programme', value: crownSchedule, inline: true },
            { name: 'Statut', value: crownStatus }
          );
        if (crownMessage.length > 1024) embed
          .setDescription(crownMessage)
          .addFields({ name: 'Message', value: 'Message situé au-dessus en raison des limites de caractères.' });
        else embed.addFields({ name: 'Message', value: crownMessage });
        return message.channel.send({ embeds: [embed] });
      case 'commands':
      case 'disabledcommands':
        return message.channel.send({ embeds: [embed
          .setTitle('Paramètres: `Commandes désactivées`')
          .addFields({ name: 'Commandes désactivées', value: disabledCommands })
        ] });
    }
    if (setting)
      return this.sendErrorMessage(message, `
      Argument invalide. Veuillez saisir une catégorie de paramètres valide. Utilisation \`${row.prefix}settings\` pour une liste.
      `);

    if (verificationMessage.length > 512) verificationMessage = verificationMessage.slice(0, 503) + '...';
    if (welcomeMessage.length > 512) welcomeMessage = welcomeMessage.slice(0, 503) + '...';
    if (leaveMessage.length > 512) leaveMessage = leaveMessage.slice(0, 503) + '...';
    if (crownMessage.length > 512) crownMessage = crownMessage.slice(0, 503) + '...';
    if (verificationMessage != '`Aucun`') verificationMessage = `\`\`\`${verificationMessage}\`\`\``;
    if (welcomeMessage != '`Aucun`') welcomeMessage = `\`\`\`${welcomeMessage}\`\`\``;
    if (leaveMessage != '`Aucun`') leaveMessage = `\`\`\`${leaveMessage}\`\`\``;
    if (crownMessage != '`Aucun`') crownMessage = `\`\`\`${crownMessage}\`\`\``;

    embed
      .setTitle('Paramètres')
      .addFields(
        { name: '__**Système**__', value: stripIndent`
          **Préfix:** ${prefix}
          **Salon système:** ${systemChannel}
          **Salon Modlog:** ${modlogChannel}
          **Rôle Administrateur:** ${adminRole}
          **Rôle Modérateur:** ${modRole}
          **Rôle Mute:** ${muteRole}
          **Auto Rôle:** ${autoRole}
          **Auto Kick:** ${autoKick}
          **Couleur aléatoire:** ${randomColor}
        ` },
        { name: '__**Vérification**__', value: stripIndent`
          **Statut:** ${verificationStatus}
          **Rôle:** ${verificationRole}
          **Salon:** ${verificationChannel}
          **Message:** ${verificationMessage}
        ` },
        { name: '__**Messages de bienvenue**__', value: stripIndent`
          **Statut:** ${welcomeStatus}
          **Salon:** ${welcomeChannel}
          **Message:** ${welcomeMessage}
        ` },
        { name: '__**Messages d\'au revoir**__', value: stripIndent`
          **Statut:** ${leaveStatus}
          **Salon:** ${leaveChannel}
          **Message:** ${leaveMessage}
        ` },
        { name: '__**Système de points**__', value: stripIndent`
          **Statut:** ${pointsStatus}
          **Points de message:** ${messagePoints}
          **Points de commande:** ${commandPoints}
          **Points de vocal:** ${voicePoints}
        ` },
        { name: '__**Système de couronne**__', value: stripIndent`
          **Statut:** ${crownStatus}
          **Programme:** ${crownSchedule}
          **Rôle:** ${crownRole}
          **Salon:** ${crownChannel}
          **Message:** ${crownMessage}
        ` },
        { name: '__**Commandes désactivées**__', value: disabledCommands }
      );

    message.channel.send({ embeds: [embed] });
  }
};