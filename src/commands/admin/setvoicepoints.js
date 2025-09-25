const Command = require('../Alcatraz.js');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = class SetVoicePointsVoice extends Command {
  constructor(client) {
    super(client, {
      name: 'setvoicepoints',
      aliases: ['setvp', 'svp'],
      usage: 'setvoicepoints <nombre de point>',
      description: 'Définit le nombre de points gagnés par minute passée dans le salon vocal.',
      type: client.types.ADMIN,
      userPermissions: [PermissionFlagsBits.ManageGuild],
      examples: ['setvoicepoints 5']
    });
  }
  run(message, args) {
    const amount = args[0];
    if (!amount || !Number.isInteger(Number(amount)) || amount < 0) 
      return this.sendErrorMessage(message, 'Argument invalide. Veuillez saisir un entier positif.');
    const { 
      point_tracking: pointTracking, 
      message_points: messagePoints, 
      command_points: commandPoints,
      voice_points: voicePoints 
    } = message.client.db.settings.selectPoints.get(message.guild.id);
    const status = message.client.utils.getStatus(pointTracking);
    message.client.db.settings.updateVoicePoints.run(amount, message.guild.id);
    const embed = new EmbedBuilder()
      .setTitle('Paramètres: `Système de points`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription('la valeur des `points de vocal` a été mise à jour avec succès. ✅')
      .addFields(
        { name: 'Points de message', value: `\`${messagePoints}\``, inline: true },
        { name: 'Points de commande', value: `\`${commandPoints}\``, inline: true },
        { name: 'Points de vocal', value: `\`${voicePoints}\` ➔ \`${amount}\``, inline: true },
        { name: 'Statut', value: status }
      )
      .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
      .setTimestamp()
      .setColor(0x2f3136);
    message.channel.send({ embeds: [embed] });
  }
};