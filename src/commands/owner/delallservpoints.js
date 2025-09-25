const Command = require('../Alcatraz.js');
const { EmbedBuilder } = require('discord.js');

const rgx = /^(?:<@!?)?(\d+)>?$/;

module.exports = class WipeAllTotalPointsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'delallservpoints',
      usage: 'delallservpoints <ID serveur>',
      description: 'Efface les points de tous les membres et le nombre total de points sur le serveur avec l\'ID fourni.',
      type: client.types.OWNER,
      ownerOnly: true,
      examples: ['delallservpoints 709992782252474429']
    });
  }
  run(message, args) {
    const guildId = args[0];
    if (!rgx.test(guildId))
      return this.sendErrorMessage(message, 0, 'Veuillez fournir un identifiant de serveur valide');
    const guild = message.client.guilds.cache.get(guildId);
    if (!guild) return this.sendErrorMessage(message, 0, 'Impossible de trouver le serveur, veuillez vérifier l\'ID fourni');
    message.client.db.users.wipeAllTotalPoints.run(guildId);
    const embed = new EmbedBuilder()
      .setTitle('J\'ai bien effacé tous les points totaux du serveur')
      .setDescription(`Les points et le total des points de **${guild.name}** ont été effacés avec succès.`)
      .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
      .setTimestamp()
      .setColor(0x2f3136);
    message.channel.send({ embeds: [embed] });
  } 
};