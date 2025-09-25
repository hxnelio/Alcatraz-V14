module.exports = (client, oldState, newState) => {
  
    if (oldState.member != newState.member) return;
    const member = newState.member;
    
    const { point_tracking: pointTracking, voice_points: voicePoints } = 
      client.db.settings.selectPoints.get(member.guild.id);
    if (!pointTracking || voicePoints == 0) return;
  
    const oldId = oldState.channelId;
    const newId = newState.channelId;
    const afkId = member.guild.afkChannelId;
  
    if (oldId === newId) return;
    else if ((!oldId || oldId === afkId) && newId && newId !== afkId) { 
      member.interval = setInterval(() => {
        client.db.users.updatePoints.run({ points: voicePoints }, member.id, member.guild.id);
      }, 60000);
    } else if (oldId && (oldId !== afkId && !newId || newId === afkId)) { 
      clearInterval(member.interval);
    }
  };