
const Command = require('../Alcatraz.js');
const { EmbedBuilder } = require('discord.js');

module.exports = class WipePointsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'deluserpoints',
      usage: 'deluserpoints <@membre/ID>',
      description: 'Efface les points de l\'utilisateur fournis.',
      type: client.types.OWNER,
      ownerOnly: true,
      examples: ['deluserpoints @Henelio']
    });
  }
  run(message, args) {
    const member =  this.getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);
    if (!member) 
      return this.sendErrorMessage(message, 0, 'Veuillez mentionner un utilisateur ou fournir un ID utilisateur valide');
    message.client.db.users.wipePoints.run(member.id, message.guild.id);
    const embed = new EmbedBuilder()
      .setTitle('J\'ai bien effacé tous les points du membre')
      .setDescription(`Les points de ${member} ont bien été effacés.`)
      .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
      .setTimestamp()
      .setColor(0x2f3136);
    message.channel.send({ embeds: [embed] });
  } 
};