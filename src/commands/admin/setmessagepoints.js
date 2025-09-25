const Command = require('../Alcatraz.js');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = class SetMessagePointsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setmessagepoints',
      aliases: ['setmp', 'smp'],
      usage: 'setmessagepoints <point>',
      description: 'Définit le nombre de points gagnés par message.',
      type: client.types.ADMIN,
      userPermissions: [PermissionFlagsBits.ManageGuild],
      examples: ['setmessagepoints 1']
    });
  }
  run(message, args) {
    const amount = args[0];
    if (!amount || !Number.isInteger(Number(amount)) || amount < 0) 
      return this.sendErrorMessage(message, 'Argument invalide. Veuillez saisir un nombre positif.');
    const { 
      point_tracking: pointTracking, 
      message_points: messagePoints, 
      command_points: commandPoints,
      voice_points: voicePoints 
    } = message.client.db.settings.selectPoints.get(message.guild.id);
    const status = message.client.utils.getStatus(pointTracking);
    message.client.db.settings.updateMessagePoints.run(amount, message.guild.id);
    const embed = new EmbedBuilder()
      .setTitle('Paramètre: `Système de points`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription('la valeur des `Systèmes de points` a été mise à jour avec succès. ✅')
      .addFields(
        { name: 'Points de message', value: `\`${messagePoints}\` ➔ \`${amount}\``, inline: true },
        { name: 'Points de commande', value: `\`${commandPoints}\``, inline: true },
        { name: 'Points de vocal', value: `\`${voicePoints}\``, inline: true },
        { name: 'Status', value: status }
      )
      .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
      .setTimestamp()
      .setColor(0x2f3136);
    message.channel.send({ embeds: [embed] });
  }
};