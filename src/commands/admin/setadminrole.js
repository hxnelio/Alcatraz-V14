const Command = require('../Alcatraz.js');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = class SetAdminRoleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setadminrole',
      aliases: ['setar', 'sar'],
      usage: 'setadminrole <role mention/ID>',
      description: 'Définit le `rôle admin` pour votre serveur. Ne fournissez aucun rôle pour effacer le `rôle admin`.',
      type: client.types.ADMIN,
      userPermissions: [PermissionFlagsBits.ManageGuild],
      examples: ['setadminrole @Admin']
    });
  }
  run(message, args) {
    const adminRoleId = message.client.db.settings.selectAdminRoleId.pluck().get(message.guild.id);
    const oldAdminRole = message.guild.roles.cache.find(r => r.id === adminRoleId) || '`Aucun`';

    const embed = new EmbedBuilder()
      .setTitle('Paramètres: Rôle Admin`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription('Le `admin role` a été mis à jour avec succès. ✅')    
      .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
      .setTimestamp()
      .setColor(0x2f3136);

    if (args.length === 0) {
      message.client.db.settings.updateAdminRoleId.run(null, message.guild.id);
      return message.channel.send({ embeds: [embed.addFields({ name: 'Role', value: `${oldAdminRole} ➔ \`Aucun\`` })] });
    }

    // Update role
    const adminRole = this.getRoleFromMention(message, args[0]) || message.guild.roles.cache.get(args[0]);
    if (!adminRole) 
      return this.sendErrorMessage(message, 'Argument invalide. Veuillez mentionner un rôle ou fournir un identifiant de rôle.');
    message.client.db.settings.updateAdminRoleId.run(adminRole.id, message.guild.id);
    message.channel.send({ embeds: [embed.addFields({ name: 'Role', value: `${oldAdminRole} ➔ ${adminRole}` })] });
  }
};