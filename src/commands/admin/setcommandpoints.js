const Command = require('../Alcatraz.js');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = class SetCommandPointsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setcommandpoints',
      aliases: ['setcp', 'scp'],
      usage: 'setcommandpoints <nombre de point>',
      description: 'Définit le nombre de points gagnés par commande utilisée.',
      type: client.types.ADMIN,
      userPermissions: [PermissionFlagsBits.ManageGuild],
      examples: ['setcommandpoints 5']
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
    message.client.db.settings.updateCommandPoints.run(amount, message.guild.id);
    const embed = new EmbedBuilder()
      .setTitle('Paramètres: `Système de points`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription('la valeur des `points de commande` a été mise à jour avec succès. ✅')
      .addFields(
        { name: 'Point de message', value: `\`${messagePoints}\``, inline: true },
        { name: 'Point de commande', value: `\`${commandPoints}\` ➔ \`${amount}\``, inline: true },
        { name: 'Point vocal', value: `\`${voicePoints}\``, inline: true },
        { name: 'Statut', value: `\`${status}\`` }
      )
      .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
      .setTimestamp()
      .setColor(0x2f3136);
    message.channel.send({ embeds: [embed] });
  }
};