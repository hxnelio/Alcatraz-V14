const { ActivityType } = require('discord.js');

module.exports = async (client) => {

    const activities = [
      { name: `${client.user.username} | Projet Open-Source`, type: ActivityType.Playing }, 
      { name: `Je suis dans ${client.guilds.cache.size} serveurs avec ${client.users.cache.size} membres`, type: ActivityType.Listening }
    ];
  
    client.user.setPresence({ status: 'online', activities: [activities[0]] });
  
    let activity = 1;
  
    setInterval(() => {
      activities[2] = { name: `${client.guilds.cache.size} serveurs`, type: ActivityType.Watching }; // Update server count
      activities[3] = { name: `${client.users.cache.size} membres`, type: ActivityType.Watching }; // Update user count
      if (activity > 3) activity = 0;
      client.user.setActivity(activities[activity].name, { type: activities[activity].type });
      activity++;
    }, 30000);
  
    client.logger.info('Mise à jour de la base de données et planification des travaux...');
    for (const guild of client.guilds.cache.values()) {
  
      const modLog = guild.channels.cache.find(c => c.name.replace('-', '').replace('s', '') === 'modlog' || 
        c.name.replace('-', '').replace('s', '') === 'moderatorlog');
  
      const adminRole = 
      guild.roles.cache.find(r => r.name.toLowerCase() === 'admin' || r.name.toLowerCase() === 'administrator');
      const modRole = guild.roles.cache.find(r => r.name.toLowerCase() === 'mod' || r.name.toLowerCase() === 'moderator');
      const muteRole = guild.roles.cache.find(r => r.name.toLowerCase() === 'muted');
      const crownRole = guild.roles.cache.find(r => r.name === 'The Crown');
  
      client.db.settings.insertRow.run(
        guild.id,
        guild.name,
        guild.systemChannelId, 
        guild.systemChannelId, 
        guild.systemChannelId, 
        guild.systemChannelId,  
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
          member.user.bot ? 1 : 0
        );
      });
      const currentMemberIds = client.db.users.selectCurrentMembers.all(guild.id).map(row => row.user_id);
      for (const id of currentMemberIds) {
        if (!guild.members.cache.has(id)) {
          client.db.users.updateCurrentMember.run(0, id, guild.id);
          client.db.users.wipeTotalPoints.run(id, guild.id);
        }
      }
      const missingMemberIds = client.db.users.selectMissingMembers.all(guild.id).map(row => row.user_id);
      for (const id of missingMemberIds) {
        if (guild.members.cache.has(id)) client.db.users.updateCurrentMember.run(1, id, guild.id);
      }
      client.utils.scheduleCrown(client, guild);
  
    }
  
    const dbGuilds = client.db.settings.selectGuilds.all();
    const guilds = Array.from(client.guilds.cache.values());
    const leftGuilds = dbGuilds.filter(g1 => !guilds.some(g2 => g1.guild_id === g2.id));
    for (const guild of leftGuilds) {
      client.db.settings.deleteGuild.run(guild.guild_id);
      client.db.users.deleteGuild.run(guild.guild_id);
  
      client.logger.info(`${client.user.username} a quitté le serveur: ${guild.guild_name}`);
    }
  
    client.logger.info(`${client.user.username} est maintenant en ligne`);
    client.logger.info(`${client.user.username} est en service sur ${client.guilds.cache.size} serveur(s)`);
  };