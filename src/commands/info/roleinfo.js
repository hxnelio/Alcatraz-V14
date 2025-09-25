const Command = require('../Alcatraz.js');
const { EmbedBuilder } = require('discord.js');
const moment = require('moment');
const permissions = require('../../utils/permissions.json');

module.exports = class RoleInfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'roleinfo',
      aliases: ['role', 'ri'],
      usage: 'roleinfo <@role/ID>',
      description: 'Récupère des informations sur le rôle fourni.',
      type: client.types.INFO,
      examples: ['roleinfo @membre']
    });
  }
  run(message, args) {

    const role = this.getRoleFromMention(message, args[0]) || message.guild.roles.cache.get(args[0]);
    if (!role)
      return this.sendErrorMessage(message, 0, 'Veuillez mentionner un rôle ou fournir un ID de rôle valide');

    const rolePermissions = role.permissions.toArray();
    const finalPermissions = [];
    for (const permission in permissions) {
      if (rolePermissions.includes(permission)) finalPermissions.push(`+ ${permissions[permission]}`);
      else finalPermissions.push(`- ${permissions[permission]}`);
    }

    const position = `\`${message.guild.roles.cache.size - role.position}\`/\`${message.guild.roles.cache.size}\``;

    const embed = new EmbedBuilder()
      .setTitle('Information du rôle')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addFields(
        { name: 'Rôle', value: role.toString(), inline: true },
        { name: 'ID du rôle', value: `\`${role.id}\``, inline: true },
        { name: 'Position', value: position, inline: true },
        { name: 'Mentionnable', value: `\`${role.mentionable}\``, inline: true },
        { name: 'Rôle du bot', value: `\`${role.managed}\``, inline: true },
        { name: 'Color', value: `\`${role.hexColor.toUpperCase()}\``, inline: true },
        { name: 'Membres', value: `\`${role.members.size}\``, inline: true },
        { name: 'Hoisted', value: `\`${role.hoist}\``, inline: true },
        { name: 'Créé le', value: `\`${moment(role.createdAt).format('DD/MM/YYYY')}\``, inline: true },
        { name: 'Permissions', value: `\`\`\`diff\n${finalPermissions.join('\n')}\`\`\`` }
      )
      .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
      .setTimestamp()
      .setColor(0x2f3136);
    message.channel.send({ embeds: [embed] });
  }
};