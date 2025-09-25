const Command = require('../Alcatraz.js');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = class BlastCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'annonce',
      usage: 'Annonce <message>',
      description: 'Envoie un message à chaque serveur dans lequel se trouve Alcatraz et qui a un salon système.',
      type: client.types.OWNER,
      ownerOnly: true,
      examples: ['Annonce Mise à jour d\'Alcatraz!']
    });
  }
  run(message, args) {
    if (!args[0]) return this.sendErrorMessage(message, 0, 'Veuillez fournir un message');
    const msg = message.content.slice(message.content.indexOf(args[0]), message.content.length);
    const guilds = [];
    message.client.guilds.cache.forEach(guild => {
      const systemChannelId = message.client.db.settings.selectSystemChannelId.pluck().get(guild.id);
      const systemChannel = guild.channels.cache.get(systemChannelId);
      if (
        systemChannel && 
        systemChannel.viewable &&
        systemChannel.permissionsFor(guild.members.me).has([PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks])
      ) {
        const embed = new EmbedBuilder()
          .setTitle('Message système d\'Alcatraz')
          .setThumbnail(message.guild.iconURL({ dynamic: true }))
          .setDescription(msg)
          .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
          .setTimestamp()
          .setColor(0x2f3136);
        systemChannel.send({ embeds: [embed] });
      } else guilds.push(guild.name);
    });
  
    if (guilds.length > 0) {
      const description = message.client.utils.trimStringFromArray(guilds);

      const embed = new EmbedBuilder()
        .setTitle('Échecs du message d\'envoi')
        .setDescription(description)
        .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
        .setTimestamp()
        .setColor(0x2f3136);
      message.channel.send({ embeds: [embed] });
    }
  } 
};