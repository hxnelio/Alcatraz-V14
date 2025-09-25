const Command = require('../Alcatraz.js');
const { EmbedBuilder } = require('discord.js');

module.exports = class TotalPointsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'totalpoints',
      usage: 'totalpoints <@membre/ID>',
      description: 'Récupère le total des points d\'un utilisateur. Si aucun utilisateur n\'est indiqué, votre propre total de points sera affiché.',
      type: client.types.POINTS,
      examples: ['totalpoints @Henelio']
    });
  }
  run(message, args) {
    const member =  this.getMemberFromMention(message, args[0]) || 
      message.guild.members.cache.get(args[0]) || 
      message.member;
    const points = message.client.db.users.selectTotalPoints.pluck().get(member.id, message.guild.id);
    const embed = new EmbedBuilder()
      .setTitle(`Total des points de ${member.displayName}`)
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