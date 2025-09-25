const { EmbedBuilder } = require('discord.js');
const { fail } = require('../utils/emojis.json');

module.exports = (client, guild) => {

  client.logger.info(`Alcatraz viens de quitté le serveur:  ${guild.name}`);
  const serverLog = client.channels.cache.get(client.serverLogId);
  if (serverLog)
    serverLog.send({ embeds: [new EmbedBuilder().setDescription(`${client.user} viens de quitté le serveur: **${guild.name}** ${fail}`)] });

  client.db.settings.deleteGuild.run(guild.id);
  client.db.users.deleteGuild.run(guild.id);

  if (guild.job) guild.job.cancel(); 

};