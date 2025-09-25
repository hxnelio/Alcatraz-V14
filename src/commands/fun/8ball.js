const Command = require('../Alcatraz.js');
const { EmbedBuilder } = require('discord.js');
const answers = [
  'Il est certain.',
  'C\'est décidément ainsi.',
  'Sans aucun doute.',
  'Oui définitivement.',
  'Vous pouvez vous y fier.',
  'Comme je le vois oui.',
  'GalackQSM est le meilleur.',
  'Bonne perspective.',
  'Oui.',
  'Non.',
  'Les signes pointent vers Oui.',
  'Je sais pas.',
  'Répondre brumeux, réessayer.',
  'Demander à nouveau plus tard.',
  'Mieux vaut ne pas te dire maintenant.',
  'Impossible de prédire maintenant.',
  'Concentrez-vous et demandez à nouveau.',
  'Ne comptez pas dessus.',
  'Ma réponse est non.',
  'Mes sources disent non.',
  'Les perspectives ne sont pas si bonnes.',
  'Très douteux.'
];

module.exports = class EightBallCommand extends Command {
  constructor(client) {
    super(client, {
      name: '8ball',
      aliases: ['fortune'],
      usage: '8ball <question>',
      description: 'Demande au 8-Ball des questions.',
      type: client.types.FUN,
      examples: ['8ball Vais-je gagner à la loterie?']
    });
  }
  run(message, args) {
    const question = args.join(' ');
    if (!question) return this.sendErrorMessage(message, 0, 'Veuillez fournir une question à poser');
    const embed = new EmbedBuilder()
      .setTitle('🎱  Je réponds à tes questions  🎱')
      .addFields(
        { name: 'Question', value: question },
        { name: 'Réponse', value: `${answers[Math.floor(Math.random() * answers.length)]}` }
      )
      .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
      .setTimestamp()
      .setColor(0x2f3136);
    message.channel.send({ embeds: [embed] });
  }
};