const Command = require('../Alcatraz.js');
const { EmbedBuilder } = require('discord.js');

module.exports = class PointsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'points',
      aliases: ['p'],
      usage: 'points <@membre/ID>',
      description: 'Récupère les points d\'un utilisateur. Si aucun utilisateur n\'est donné, vos propres points seront affichés.',
      type: client.types.POINTS,
      examples: ['points @Henelio']
    });
  }
  run(message, args) {
    const member =  this.getMemberFromMention(message, args[0]) || 
      message.guild.members.cache.get(args[0]) || 
      message.member;
    const points = message.client.db.users.selectPoints.pluck().get(member.id, message.guild.id);
    const embed = new EmbedBuilder()
      .setTitle(`Points actuel de ${member.displayName}`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: 'Membre', value: message.member.toString(), inline: true },
        { name: 'Points', value: `\`${points}\``, inline: true }
      )
      .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
      .setTimestamp()
      .setColor(0x2f3136);
    message.channel.send({ embeds: [embed] });
  }
};