const Command = require('../Alcatraz.js');
const { EmbedBuilder } = require('discord.js');


module.exports = class EmbedCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'embed',
      usage: 'embed <message>',
      description: 'Envoie votre message en tant que embed',
      type: client.types.GENERAL,
      examples: ['embed Alcatraz the best!']
    });
  }
  run(message, args) {
    const msg = args.join(' ');
    if (!msg) return this.sendErrorMessage(message, 0, 'Veuillez fournir un message.');
    
    if (msg.toLowerCase().includes('@here') || msg.toLowerCase().includes('@everyone')) {
      return this.sendErrorMessage(message, 0, 'Vous ne pouvez pas utiliser @here ou @everyone dans un embed.');
    }
    
    const embed = new EmbedBuilder()
      .setDescription(`${msg}`)
      .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
      .setTimestamp()
      .setColor(0x2f3136);
    message.channel.send({ embeds: [embed] });
  }
};