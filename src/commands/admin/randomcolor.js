const Command = require('../Alcatraz.js');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = class ToggleRandomColorCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'randomcolor',
      usage: 'randomcolor',
      description: `
        Active ou désactive l'attribution de rôles de couleur aléatoires lorsque quelqu'un rejoint votre serveur.
      `,
      type: client.types.ADMIN,
      userPermissions: [PermissionFlagsBits.ManageGuild]
    });
  }
  run(message) {
    let randomColor = message.client.db.settings.selectRandomColor.pluck().get(message.guild.id);
    randomColor = 1 - randomColor; // Invert
    message.client.db.settings.updateRandomColor.run(randomColor, message.guild.id);
    let description, status;
    if (randomColor == 1) {
      status = '`non actif`	➔ `actif`';
      description = 'Les `Couleurs aléatoire` sont maintenant **actif**. ✅';
    } else {
      status = '`actif` ➔ `non actif`';
      description = 'Les `Couleurs aléatoire` sont maintenant **non actif**. ❌';   
    } 
    
    const embed = new EmbedBuilder()
      .setTitle('Paramètres: `Couleurs aléatoire`')
      .setThumbnail(message.guild.iconURL())
      .setDescription(description)
      .addFields(
        { name: 'Status', value: status, inline: true }
      )
      .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
      .setTimestamp()
      .setColor(0x2f3136);
    message.channel.send({ embeds: [embed] });
  }
};