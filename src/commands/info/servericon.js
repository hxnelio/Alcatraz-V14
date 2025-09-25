const Command = require('../Alcatraz.js');
const { EmbedBuilder } = require('discord.js');

module.exports = class ServerIconCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'servericon',
      aliases: ['icon', 'i'],
      usage: 'servericon',
      description: 'Affiche l\'icône du serveur.',
      type: client.types.INFO
    });
  }
  run(message) {
    const embed = new EmbedBuilder()
      .setTitle(`Icône du serveur ${message.guild.name}`)
      .setImage(message.guild.iconURL({ dynamic: true, size: 512 }))
      .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
      .setTimestamp()
      .setColor(0x2f3136);
    message.channel.send({ embeds: [embed] });
  }
};