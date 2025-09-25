const Command = require('../Alcatraz.js');
const { EmbedBuilder } = require('discord.js');

module.exports = class PrefixCommand extends Command {
    constructor(client) {
      super(client, {
        name: 'prefix',
        aliases: ['pre'],
        usage: 'prefix',
        description: 'Récupère le préfix actuel de d\'Alcatraz.',
        type: client.types.INFO
      });
    }
    run(message) {
      const prefix = message.client.db.settings.selectPrefix.pluck().get(message.guild.id);
      const embed = new EmbedBuilder()
        .setTitle('Préfix d\'Alcatraz')
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .addFields(
          { name: 'Préfix', value: `\`${prefix}\``, inline: true },
          { name: 'Exemple', value: `\`${prefix}help\``, inline: true }
        )
        .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
        .setTimestamp()
        .setColor(0x2f3136);
      message.channel.send({ embeds: [embed] });
    }
  };