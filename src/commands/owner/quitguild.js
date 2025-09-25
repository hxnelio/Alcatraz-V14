const Command = require('../Alcatraz.js');
const { EmbedBuilder } = require('discord.js');

const rgx = /^(?:<@!?)?(\d+)>?$/;

module.exports = class LeaveGuildCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'quitguild',
      usage: 'quitguild <ID serveur>',
      description: 'Force Alcatraz à quitter le serveur spécifié.',
      type: client.types.OWNER,
      ownerOnly: true,
      examples: ['quitguild 709992782252474429']
    });
  }
  async run(message, args) {
    const guildId = args[0];
    if (!rgx.test(guildId))
      return this.sendErrorMessage(message, 0, 'Veuillez fournir un identifiant de serveur valide');
    const guild = message.client.guilds.cache.get(guildId);
    if (!guild) return this.sendErrorMessage(message, 0, 'Impossible de trouver le serveur, veuillez vérifier l\'ID fourni');
    await guild.leave();
    const embed = new EmbedBuilder()
      .setTitle('J\'ai bien quitté le serveur de force')
      .setDescription(`J'ai quitté avec succès le serveur **${guild.name}**.`)
      .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
      .setTimestamp()
      .setColor(0x2f3136);
    message.channel.send({ embeds: [embed] });
  } 
};