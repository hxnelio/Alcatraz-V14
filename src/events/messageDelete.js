const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = (client, message) => {
  
  // Check for webhook and that message is not empty
  if (message.webhookID || (!message.content && message.embeds.length === 0)) return;
  
  const embed = new EmbedBuilder()
    .setTitle('Message Update: `Delete`')
    .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
    .setTimestamp()
    .setColor(message.guild.members.me.displayHexColor);
  
  // Message delete
  if (message.content) {

    // Dont send logs for starboard delete
    const starboardChannelId = client.db.settings.selectStarboardChannelId.pluck().get(message.guild.id);
    const starboardChannel = message.guild.channels.cache.get(starboardChannelId);
    if (message.channel == starboardChannel) return;

    // Get message delete log
    const messageDeleteLogId = client.db.settings.selectMessageDeleteLogId.pluck().get(message.guild.id);
    const messageDeleteLog = message.guild.channels.cache.get(messageDeleteLogId);
    if (
      messageDeleteLog &&
      messageDeleteLog.viewable &&
      messageDeleteLog.permissionsFor(message.guild.members.me).has([PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks])
    ) {

      if (message.content.length > 1024) message.content = message.content.slice(0, 1021) + '...';

      embed
        .setDescription(`${message.member}'s **message** in ${message.channel} was deleted.`)
        .addFields({ name: 'Message', value: message.content });
        
      messageDeleteLog.send({ embeds: [embed] });
    }

  // Embed delete
  } else { 

    // Get message delete log
    const messageDeleteLogId = client.db.settings.selectMessageDeleteLogId.pluck().get(message.guild.id);
    const messageDeleteLog = message.guild.channels.cache.get(messageDeleteLogId);
    if (
      messageDeleteLog &&
      messageDeleteLog.viewable &&
      messageDeleteLog.permissionsFor(message.guild.members.me).has([PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks])
    ) {

      embed
        .setTitle('Message Update: `Delete`')
        .setDescription(`${message.member}'s **message embed** in ${message.channel} was deleted.`);
      messageDeleteLog.send({ embeds: [embed] });
    }
  }
  
};