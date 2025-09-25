const Command = require('../Alcatraz.js');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { oneLine } = require('common-tags');

module.exports = class ColorCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'couleur',
      aliases: ['changecolor', 'c'],
      usage: 'couleur <@role/ID> <couleur>',
      description: oneLine`
        Remplace votre couleur actuelle par celle spécifiée. Ne fournissez aucune couleur pour effacer votre rôle de couleur actuel.
      `,
      type: client.types.COLOR,
      clientPermissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.ManageRoles],
      examples: ['couleur Blanc #ffffff']
    });
  }
 async run(message, args) {
    const prefix = message.client.db.settings.selectPrefix.pluck().get(message.guild.id);
    const embed = new EmbedBuilder()
      .setTitle('Changement de couleur')
      .setThumbnail(message.member.user.displayAvatarURL({ dynamic: true }))
      .addFields({ name: 'Membre', value: message.member.toString(), inline: true })
      .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
      .setTimestamp()
      .setColor(0x2f3136);
    const colors = message.guild.roles.cache.filter(c => c.name.startsWith('#'));
    const colorName = args.join('').toLowerCase();
    const oldColor = (message.member.roles.color && message.member.roles.color.name.startsWith('#')) ? 
      message.member.roles.color : '`Aucun`';

    if (!colorName) {
      try {
        await message.member.roles.remove(colors);
        return message.channel.send({ embeds: [embed.addFields({ name: 'Couleur', value: `${oldColor} ➔ \`Aucun\``, inline: true })] });
      } catch (err) {
        message.client.logger.error(err.stack);
        return this.sendErrorMessage(message, 1, 'Veuillez vérifier la hiérarchie des rôles', err.message);
      }
    }

    const role = this.getRoleFromMention(message, args[0]) || message.guild.roles.cache.get(args[0]);
    let color;
    if (role && colors.get(role.id)) color = role;
    if (!color) {
      color = colors.find(c => {
        return colorName == c.name.slice(1).toLowerCase().replace(/\s/g, '') || 
          colorName == c.name.toLowerCase().replace(/\s/g, '');
      });
    }
    if (!color)
      return this.sendErrorMessage(message, 0, `Veuillez fournir une couleur valide, utilisez ${prefix}colors pour voir la liste`);
    else {
      try {
        await message.member.roles.remove(colors);
        await message.member.roles.add(color);
        message.channel.send({ embeds: [embed.addFields({ name: 'Couleur', value: `${oldColor} ➔ ${color}`, inline: true }).setColor(color.hexColor)] });
      } catch (err) {
        message.client.logger.error(err.stack);
        this.sendErrorMessage(message, 1, 'Veuillez vérifier la hiérarchie des rôles', err.message);
      }
    }
  }
};