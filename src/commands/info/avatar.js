const Command = require('../Alcatraz.js');
const { EmbedBuilder } = require('discord.js');

module.exports = class AvatarCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'avatar',
      aliases: ['profilepic', 'pic', 'a'],
      usage: 'avatar [@membre/ID]',
      description: 'Affiche l\'avatar d\'un utilisateur (ou le vôtre, si aucun utilisateur n\'est mentionné).',
      type: client.types.INFO,
      examples: ['avatar @Alcatraz']
    });
  }
  run(message, args) {
    const member =  this.getMemberFromMention(message, args[0]) || 
      message.guild.members.cache.get(args[0]) || 
      message.member;
    const embed = new EmbedBuilder()
      .setTitle(`Avatar de ${member.displayName}`)
      .setImage(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
      .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
      .setTimestamp()
      .setColor(0x2f3136);
    message.channel.send({ embeds: [embed] });
  }
};