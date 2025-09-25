const Command = require('../Alcatraz.js');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = class RandomColorCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'couleurhasard',
      aliases: ['rc'],
      usage: 'couleurhasard',
      description: 'Change votre couleur actuelle en une couleur différente au hasard.',
      type: client.types.COLOR,
      clientPermissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.ManageRoles]
    });
  }
  async run(message) {
    
    const embed = new EmbedBuilder()
      .setTitle('Changement de couleur')
      .setThumbnail(message.member.user.displayAvatarURL({ dynamic: true }))
      .addFields({ name: 'Membre', value: message.member.toString(), inline: true })
      .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
      .setTimestamp()
      .setColor(0x2f3136);
    const colors = Array.from(message.guild.roles.cache.filter(c => c.name.startsWith('#')).values());
    if (colors.length === 0) return this.sendErrorMessage(message, 'Il n\'y a actuellement aucune couleur définie sur ce serveur.');
    const color = colors[Math.floor(Math.random() * colors.length)];
    const oldColor = (message.member.roles.color && message.member.roles.color.name.startsWith('#')) ? 
      message.member.roles.color : '`Aucune`';

    try {
      await message.member.roles.remove(colors);
      await message.member.roles.add(color);
      message.channel.send({ embeds: [embed.addFields({ name: 'Couleur', value: `${oldColor} ➔ ${color}`, inline: true }).setColor(color.hexColor)] });
    } catch (err) {
      message.client.logger.error(err.stack);
      this.sendErrorMessage(message, 'Un problème est survenu. Veuillez vérifier la hiérarchie des rôles.', err.message);
    }
  }
};