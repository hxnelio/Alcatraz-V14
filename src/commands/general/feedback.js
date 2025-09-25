const Command = require('../Alcatraz.js');
const { EmbedBuilder } = require('discord.js');
const { oneLine } = require('common-tags');

module.exports = class FeedbackCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'feedback',
      aliases: ['fb'],
      usage: 'feedback <message>',
      description: 'Envoie un feedback sur le salon.',
      type: client.types.GENERAL,
      examples: ['feedback <votre problème>']
    });
  }
  run(message, args) {
    const feedbackChannel = message.client.channels.cache.get(message.client.feedbackChannelId);
    if (!feedbackChannel) 
      return this.sendErrorMessage(message, 1, 'L\'ID du salon **feedback** dans le fichier **config.js** n\'a pas été définie');
    if (!args[0]) return this.sendErrorMessage(message, 0, 'Veuillez fournir un message à envoyer');
    let feedback = message.content.slice(message.content.indexOf(args[0]), message.content.length);

    const feedbackEmbed = new EmbedBuilder()
      .setTitle('Retour d\'information')
      .setThumbnail(feedbackChannel.guild.iconURL({ dynamic: true }))
      .setDescription(feedback)
      .addFields(
        { name: 'Membre', value: message.member.toString(), inline: true },
        { name: 'Serveur', value: message.guild.name, inline: true }
      )
      .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
      .setTimestamp()
      .setColor(0x2f3136);
    feedbackChannel.send({ embeds: [feedbackEmbed] });

    if (feedback.length > 1024) feedback = feedback.slice(0, 1021) + '...';
    const embed = new EmbedBuilder()
      .setTitle('Retour d\'information')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(oneLine`
        Commentaires envoyés avec succès!
        Veuillez rejoindre le serveur [Alcatraz Empire](https://discord.gg/HPtTfqDdMr) pour discuter d'avantage de vos commentaires.
      `) 
      .addFields(
        { name: 'Membre', value: message.member.toString(), inline: true },
        { name: 'Message', value: feedback }
      )
      .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
      .setTimestamp()
      .setColor(0x2f3136);
    message.channel.send({ embeds: [embed] });
  }
};