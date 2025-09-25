const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = (client, member) => {

  if (member.user === client.user) return;

  client.logger.info(`${member.guild.name}: ${member.user.tag} a quitté le serveur`);

  /** ------------------------------------------------------------------------------------------------
   * MEMBER LOG
   * ------------------------------------------------------------------------------------------------ */
  // Get member log
  const memberLogId = client.db.settings.selectMemberLogId.pluck().get(member.guild.id);
  const memberLog = member.guild.channels.cache.get(memberLogId);
  if (
    memberLog &&
    memberLog.viewable &&
    memberLog.permissionsFor(member.guild.members.me).has([PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks])
  ) {
    const embed = new EmbedBuilder()
      .setTitle('Membre gauche')
      .setAuthor({ name: `${member.guild.name}`, iconURL: member.guild.iconURL({ dynamic: true }) })
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setDescription(`${member} (**${member.user.tag}**)`)
      .setTimestamp()
      .setColor(member.guild.members.me.displayHexColor);
    memberLog.send({ embeds: [embed] });
  }

  /** ------------------------------------------------------------------------------------------------
   * FAREWELL MESSAGES
   * ------------------------------------------------------------------------------------------------ */ 
  // Send farewell message
  let { farewell_channel_id: farewellChannelId, farewell_message: farewellMessage } = 
    client.db.settings.selectFarewells.get(member.guild.id);
  const farewellChannel = member.guild.channels.cache.get(farewellChannelId);
  
  if (
    farewellChannel &&
    farewellChannel.viewable &&
    farewellChannel.permissionsFor(member.guild.members.me).has([PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks]) &&
    farewellMessage
  ) {
    farewellMessage = farewellMessage
      .replace(/`?\?member`?/g, member) 
      .replace(/`?\?username`?/g, member.user.username) 
      .replace(/`?\?tag`?/g, member.user.tag) 
      .replace(/`?\?size`?/g, member.guild.members.cache.size); 
    farewellChannel.send({ embeds: [new EmbedBuilder().setDescription(farewellMessage).setColor(member.guild.members.me.displayHexColor)] });
  }
  
  /** ------------------------------------------------------------------------------------------------
   * USERS TABLE
   * ------------------------------------------------------------------------------------------------ */ 
  // Update users table
  client.db.users.updateCurrentMember.run(0, member.id, member.guild.id);
  client.db.users.wipeTotalPoints.run(member.id, member.guild.id);

};