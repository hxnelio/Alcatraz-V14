const Command = require('../Alcatraz.js');
const { EmbedBuilder } = require('discord.js');
const { stripIndent } = require('common-tags');
const emojis = require('../../utils/emojis.json');

module.exports = class ServerCountCommand extends Command {
    constructor(client) {
      super(client, {
        name: 'servercount',
        aliases: ['sc'],
        usage: 'servercount',
        description: 'Récupère les stats des serveurs.',
        type: client.types.INFO
      });
    }
    run(message) {
      const counts = stripIndent`
        Serveurs :: ${message.client.guilds.cache.size}
        Membres   :: ${message.client.users.cache.size}
        Emojis   :: ${message.client.emojis.cache.size}
      `;
      const embed = new EmbedBuilder()
        .setTitle(''+emojis.creation+' Information des stats des serveurs')
        .setDescription(stripIndent`\`\`\`asciidoc\n${counts}\`\`\``)
        .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
        .setTimestamp()
        .setColor(0x2f3136);
      message.channel.send({ embeds: [embed] });
    }
  };