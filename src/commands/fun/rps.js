const Command = require('../Alcatraz.js');
const { EmbedBuilder } = require('discord.js');
const rps = ['ciseaux','pierre', 'feuille'];
const res = ['Ciseaux :v:','Pierre :fist:', 'Feuille :raised_hand:'];

module.exports = class RockPaperScissorsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'pfc',
      usage: 'pfc <pierre | feuille | ciseaux>',
      description: 'Jouez à une partie de pierre-feuille-ciseaux contre Alcatraz!',
      type: client.types.FUN,
      examples: ['pfc pierre']
    });
  }
  run(message, args) {
    let userChoice;
    if (args.length) userChoice = args[0].toLowerCase();
    if (!rps.includes(userChoice)) 
      return this.sendErrorMessage(message, 0, 'Merci d\'entrer `pierre`, `feuille`, ou `ciseaux`.');
    userChoice = rps.indexOf(userChoice);
    const botChoice = Math.floor(Math.random()*3);
    let result;
    if (userChoice === botChoice) result = 'C\'est un match nul!';
    else if (botChoice > userChoice || botChoice === 0 && userChoice === 2) result = '**Alcatraz** gagne !';
    else result = `**${message.member.displayName}** gagne !`;
    const embed = new EmbedBuilder()
      .setTitle(`${message.member.displayName} vs. Alcatraz`)
      .addFields(
        { name: 'Votre choix:', value: res[userChoice], inline: true },
        { name: 'Le choix de Alcatraz', value: res[botChoice], inline: true },
        { name: 'Résultat', value: result, inline: true }
      )
      .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
      .setTimestamp()
      .setColor(0x2f3136);
    message.channel.send({ embeds: [embed] });
  }
};