const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = (client, messages) => {
  
  const message = messages.first();
  
  // Get message delete log
  const messageDeleteLogId = client.db.settings.selectMessageDeleteLogId.pluck().get(message.guild.id);
  const messageDeleteLog = message.guild.channels.cache.get(messageDeleteLogId);
  if (
    messageDeleteLog &&
    messageDeleteLog.viewable &&
    messageDeleteLog.permissionsFor(message.guild.members.me).has([PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks])
  ) {

    const embed = new EmbedBuilder()
      .setTitle('Message Update: `Bulk Delete`')
      .setAuthor({ name: `${message.guild.name}`, iconURL: message.guild.iconURL({ dynamic: true }) })
      .setDescription(`**${messages.size} messages** in ${message.channel} were deleted.`)
      .setTimestamp()
      .setColor(message.guild.members.me.displayHexColor);
    messageDeleteLog.send({ embeds: [embed] });
  }

};