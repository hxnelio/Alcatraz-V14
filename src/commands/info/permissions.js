const Command = require('../Alcatraz.js');
const { EmbedBuilder } = require('discord.js');
const permissions = require('../../utils/permissions.json');
const { oneLine } = require('common-tags');

module.exports = class PermissionsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'permissions',
      aliases: ['perms'],
      usage: 'permissions [@membre/ID]',
      description: oneLine`
        Affiche toutes les autorisations actuelles pour l'utilisateur spécifié.
        Si aucun utilisateur n'est donné, vos propres autorisations seront affichées.
      `,
      type: client.types.INFO,
      examples: ['permissions @Alcatraz']
    });
  }
  run(message, args) {
    const member =  this.getMemberFromMention(message, args[0]) || 
      message.guild.members.cache.get(args[0]) || 
      message.member;
    const memberPermissions = member.permissions.toArray().sort((a, b) => {
      return Object.keys(permissions).indexOf(a) - Object.keys(permissions).indexOf(b);
    }).map(p => '`' + permissions[p] + '`').join('\n');
    const embed = new EmbedBuilder()
      .setTitle(`Permissions de ${member.displayName}`)
      .setThumbnail(member.user.displayAvatarURL())
      .setDescription(memberPermissions)
      .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
      .setTimestamp()
      .setColor(0x2f3136);
    message.channel.send({ embeds: [embed] });
  }
};