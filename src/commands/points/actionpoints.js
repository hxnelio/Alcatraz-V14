const Command = require('../Alcatraz.js');
const { EmbedBuilder } = require('discord.js');
const { stripIndent } = require('common-tags');

module.exports = class PointPerCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'actionpoints',
      aliases: ['actpoint', 'ap'],
      usage: 'actionpoints',
      description: 'Affiche le nombre de points gagnés par action.',
      type: client.types.POINTS
    });
  }
  run(message) {
    
    const { message_points: messagePoints, command_points: commandPoints, voice_points: voicePoints } 
      = message.client.db.settings.selectPoints.get(message.guild.id);
    const pointsPer = stripIndent`
      Points de message :: ${messagePoints} par message
      Points de commande :: ${commandPoints} par commande
      Points de vaocal   :: ${voicePoints} par minute
    `;

    const embed = new EmbedBuilder()
      .setTitle('Points par action')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`\`\`\`asciidoc\n${pointsPer}\`\`\``)
      .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
      .setTimestamp()
      .setColor(0x2f3136);
    message.channel.send({ embeds: [embed] });
  }
};