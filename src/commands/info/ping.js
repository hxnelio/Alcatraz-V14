const Command = require('../Alcatraz.js');
const { EmbedBuilder } = require('discord.js');
const emojis = require('../../utils/emojis.json');
const { stripIndent } = require('common-tags');

module.exports = class PingCommand extends Command {
    constructor(client) {
      super(client, {
        name: 'ping',
        usage: 'ping',
        description: 'Obtient la latence actuelle et la latence API d\'Alacatraz.',
        type: client.types.INFO
      });
    }
    async run(message) {
      const embed = new EmbedBuilder()
        .setDescription('Recherche du ping...')
        .setColor(0x2f3136);
      const msg = await message.channel.send({ embeds: [embed] });
      const timestamp = (message.editedTimestamp) ? message.editedTimestamp : message.createdTimestamp; 
      embed.setTitle(''+emojis.pong+' Résultat de la latence!')
        .setDescription(stripIndent`
          **Latence:** \`${Math.floor(msg.createdTimestamp - timestamp)}ms\`
          **Latence API:** \`${Math.round(message.client.ws.ping)}ms\`
        `)
        .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
        .setTimestamp()
        .setColor(0x2f3136);
      msg.edit({ embeds: [embed] });
    }
  };