const { EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const colors = require('../utils/colors.json');
const { success } = require('../utils/emojis.json');

module.exports = async (client, guild) => {

  client.logger.info(`Alcatraz viens de rejoindre le serveur: ${guild.name}`);
  const serverLog = client.channels.cache.get(client.serverLogId);
  if (serverLog)
    serverLog.send({ embeds: [new EmbedBuilder().setDescription(`${client.user} viens de rejoindre le serveur: **${guild.name}** ${success}`)] });

  const modLog = guild.channels.cache.find(c => c.name.replace('-', '').replace('s', '') === 'modlog' || 
    c.name.replace('-', '').replace('s', '') === 'moderatorlog');

  const adminRole = 
    guild.roles.cache.find(r => r.name.toLowerCase() === 'admin' || r.name.toLowerCase() === 'administrator');
  const modRole = guild.roles.cache.find(r => r.name.toLowerCase() === 'mod' || r.name.toLowerCase() === 'moderator');

  let muteRole = guild.roles.cache.find(r => r.name.toLowerCase() === 'muted');
  if (!muteRole) {
    try {
      muteRole = await guild.roles.create({
        name: 'Muted',
        permissions: []
      });
    } catch (err) {
      client.logger.error(err.message);
    }
    for (const channel of guild.channels.cache.values()) {
      try {
        if (channel.viewable && channel.permissionsFor(guild.members.me).has(PermissionFlagsBits.ManageRoles)) {
          if (channel.type === ChannelType.GuildText)
            await channel.permissionOverwrites.edit(muteRole, {
              SendMessages: false,
              AddReactions: false
            });
          else if (channel.type === ChannelType.GuildVoice && channel.editable) 
            await channel.permissionOverwrites.edit(muteRole, {
              Speak: false,
              Stream: false
            });
        } 
      } catch (err) {
        client.logger.error(err.stack);
      }
    }
  }
  
  let crownRole = guild.roles.cache.find(r => r.name === 'The Crown');
  if (!crownRole) {
    try {
      crownRole = await guild.roles.create({
        name: 'The Crown',
        permissions: [],
        hoist: true
      });
    } catch (err) {
      client.logger.error(err.message);
    }
  }
  client.db.settings.insertRow.run(
    guild.id,
    guild.name,
    guild.systemChannelID, 
    guild.systemChannelID,
    guild.systemChannelID, 
    guild.systemChannelID,
    modLog ? modLog.id : null,
    adminRole ? adminRole.id : null,
    modRole ? modRole.id : null,
    muteRole ? muteRole.id : null,
    crownRole ? crownRole.id : null
  );

  guild.members.cache.forEach(member => {
    client.db.users.insertRow.run(
      member.id, 
      member.user.username, 
      member.user.discriminator,
      guild.id, 
      guild.name,
      member.joinedAt.toString(),
      member.bot ? 1 : 0
    );
  });

  let position = 1;
  for (let [key, value] of Object.entries(colors)){
    key = '#' + key;
    if (!guild.roles.cache.find(r => r.name === key)) {
      try {
        await guild.roles.create({
          name: key,
          color: value,
          position: position,
          permissions: []
        });
        position++;
      } catch (err) {
        client.logger.error(err.message);
      }
    }
  }

  try {
    const AlcatrazCouleur = guild.roles.cache.find(r => r.name === '#Seagrass');
    if (AlcatrazCouleur) await guild.members.me.roles.add(AlcatrazCouleur);
  } catch (err) {
    client.logger.error(err.message);
  }
  
};