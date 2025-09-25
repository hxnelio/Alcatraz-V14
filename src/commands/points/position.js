const Command = require('../Alcatraz.js');
const { EmbedBuilder } = require('discord.js');
const { oneLine } = require('common-tags');

module.exports = class PositionCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'position',
      aliases: ['pos'],
      usage: 'position <@membre/ID>',
      description: oneLine`
        Récupère la position actuelle du classement d'un utilisateur.
        Si aucun utilisateur n'est indiqué, votre propre position sera affichée.`,
      type: client.types.POINTS,
      examples: ['position @Henelio']
    });
  }
  run(message, args) {
    const member =  this.getMemberFromMention(message, args[0]) || 
      message.guild.members.cache.get(args[0]) || 
      message.member;
    const leaderboard = message.client.db.users.selectLeaderboard.all(message.guild.id);
    const pos = leaderboard.map(row => row.user_id).indexOf(member.id) + 1;
    const ordinalPos = message.client.utils.getOrdinalNumeral(pos);
    const points = message.client.db.users.selectPoints.pluck().get(member.id, message.guild.id);
    const embed = new EmbedBuilder()
      .setTitle(`Position actuel de ${member.displayName}`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setDescription(`${member} est a là **${ordinalPos}** place!`)
      .addFields(
        { name: 'Position', value: `\`${pos}\` sur \`${message.guild.members.cache.size}\``, inline: true },
        { name: 'Points', value: `\`${points}\``, inline: true }
      )
      .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
      .setTimestamp()
      .setColor(0x2f3136);
    message.channel.send({ embeds: [embed] });
  }
};