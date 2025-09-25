const Command = require('../Alcatraz.js');
const { EmbedBuilder } = require('discord.js');

module.exports = class RollCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'des',
      aliases: ['dice', 'roll'],
      usage: 'des <côtés de dés>',
      description: 'Lance un dé avec le nombre de faces spécifié. Par défaut à 6 côtés si aucun numéro n\'est donné.',
      type: client.types.FUN
    });
  }
  run(message, args) {
    let limit = args[0];
    if (!limit) limit = 6;
    const n = Math.floor(Math.random() * limit + 1);
    if (!n || limit <= 0) this.sendErrorMessage(message, 'Argument invalide. Veuillez spécifier le nombre de faces des dés.');
    const embed = new EmbedBuilder()
      .setTitle('🎲  Lancer de dès  🎲')
      .setDescription(`${message.member}, tu es tombé sur un **${n}**!`)
      .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
      .setTimestamp()
      .setColor(0x2f3136);
    message.channel.send({ embeds: [embed] });
  }
};