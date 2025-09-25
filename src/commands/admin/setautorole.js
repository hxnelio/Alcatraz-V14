const Command = require('../Alcatraz.js');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { oneLine } = require('common-tags');

module.exports = class SetAutoRoleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setautorole',
      aliases: ['setaur', 'saur'],
      usage: 'setautorole <role mention/ID>',
      description: oneLine`
      Définit le rôle que tous les nouveaux membres recevront lorsqu'ils rejoindront votre serveur.
      Ne donnez aucun rôle pour effacer le courant \`auto role\`.
      `,
      type: client.types.ADMIN,
      userPermissions: [PermissionFlagsBits.ManageGuild],
      examples: ['setautorole @Membres']
    });
  }
  run(message, args) {
    const autoRoleId = message.client.db.settings.selectAutoRoleId.pluck().get(message.guild.id);
    const oldAutoRole = message.guild.roles.cache.find(r => r.id === autoRoleId) || '`None`';

    const embed = new EmbedBuilder()
      .setTitle('Settings: `Auto Role`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription('Le `auto role` a été mis à jour avec succès. ✅')
      .setFooter({ text: message.member.displayName, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
      .setTimestamp()
      .setColor(message.guild.members.me.displayHexColor);

    if (args.length === 0) {
      message.client.db.settings.updateAutoRoleId.run(null, message.guild.id);
      return message.channel.send({ embeds: [embed.addFields({ name: 'Role', value: `${oldAutoRole} ➔ \`None\`` })] });
    }

    const autoRole = this.getRoleFromMention(message, args[0]) || message.guild.roles.cache.get(args[0]);
    if (!autoRole) 
      return this.sendErrorMessage(message, 'Argument invalide. Veuillez mentionner un rôle ou fournir un identifiant de rôle.');
    message.client.db.settings.updateAutoRoleId.run(autoRole.id, message.guild.id);
    message.channel.send({ embeds: [embed.addFields({ name: 'Role', value: `${oldAutoRole} ➔ ${autoRole}` })] });
  }
};