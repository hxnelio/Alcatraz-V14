const Command = require('../Alcatraz.js');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

const rgx = /^#?[0-9A-F]{6}$/i;

module.exports = class CreateColorCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'creecouleur',
      aliases: ['cc'],
      usage: 'createcolor <hex> <nopm de la couleur>',
      description: 'Crée un nouveau rôle pour l\'hex de couleur donné. Les rôles de couleur sont indiqués par le préfix `#`.',
      type: client.types.COLOR,
      clientPermissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.ManageRoles],
      userPermissions: [PermissionFlagsBits.ManageRoles],
      examples: ['creecouleur #ffffff Blanc']
    });
  }
  async run(message, args) {
    let hex = args.shift();
    if (args.length === 0 || !rgx.test(hex))
      return this.sendErrorMessage(message, 'Arguments non valides. Veuillez fournir un hex de couleur et un nom de couleur.');
    let colorName = args.join(' ');
    if (!colorName.startsWith('#')) colorName = '#' + colorName;
    if (!hex.startsWith('#')) hex = '#' + hex;
    try {
      const role = await message.guild.roles.create({
        name: colorName,
        color: hex,
        permissions: []
      });
      const embed = new EmbedBuilder()
        .setTitle('Créations des couleurs')
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .setDescription(`Création réussie du ${role} couleur.`)
        .addFields(
          { name: 'Hex', value: `\`${hex}\``, inline: true },
          { name: 'Nom de la couleur', value: `\`${colorName.slice(1, colorName.length)}\``, inline: true }
        )
        .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
        .setTimestamp()
        .setColor(hex);
      message.channel.send({ embeds: [embed] });
    } catch (err) {
      message.client.logger.error(err.stack);
      this.sendErrorMessage(message, 'Un problème est survenu. Veuillez réessayer.', err.message);
    }
  }
};