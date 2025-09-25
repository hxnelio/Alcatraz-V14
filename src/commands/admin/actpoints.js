                                                                       
const Command = require('../Alcatraz.js');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = class TogglePointsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'actpoints',
      usage: 'actpoints',
      description: 'Active ou désactive les suivis des points.',
      type: client.types.ADMIN,
      userPermissions: [PermissionFlagsBits.ManageGuild],
      examples: ['points @membre']

    });
  }
  run(message) {
    let { 
      point_tracking: pointTracking, 
      message_points: messagePoints, 
      command_points: commandPoints,
      voice_points: voicePoints 
    } = message.client.db.settings.selectPoints.get(message.guild.id);
    pointTracking = 1 - pointTracking; 
    message.client.db.settings.updatePointTracking.run(pointTracking, message.guild.id);

    let description, status;
    if (pointTracking == 1) {
      status = '`non actif`	🡪 `actif`';
      description = '`Les points` sont maintenant **actif**. ✅';
    } else {
      status = '`actif` ➔ `non actif`';
      description = '`Les points` sont maintenant **non actif**. ❌';   
    } 
    
    const embed = new EmbedBuilder()
      .setTitle('Paramètres: `système de points`')
      .setThumbnail(message.guild.iconURL())
      .setDescription(description)
      .addFields(
        { name: 'Points de message', value: `\`${messagePoints}\``, inline: true },
        { name: 'Points de commande', value: `\`${commandPoints}\``, inline: true },
        { name: 'Points de vocal', value: `\`${voicePoints}\``, inline: true },
        { name: 'Statut', value: status }
      )
      .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
      .setTimestamp()
      .setColor(0x2f3136);
    message.channel.send({ embeds: [embed] });
  }
};