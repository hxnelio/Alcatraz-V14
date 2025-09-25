const Command = require('../Alcatraz.js');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = class GithubCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'github',
      aliases: ['repo', 'source'],
      usage: 'github',
      description: 'Affiche le lien vers le dépôt GitHub d\'Alcatraz.',
      type: client.types.INFO,
      clientPermissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks]
    });
  }
  
  run(message) {
    const embed = new EmbedBuilder()
      .setTitle('🔗 GitHub - Alcatraz')
      .setDescription('Alcatraz est un projet open-source ! Vous pouvez consulter le code source, contribuer ou signaler des bugs.')
      .addFields(
        { name: 'Dépôt GitHub', value: '[github.com/hxnelio/Alcatraz-V14](https://github.com/GalackQSM/Alcatraz)', inline: true },
        { name: 'Signaler un bug', value: '[Créer une issue](https://github.com/hxnelio/Alcatraz-V14/issues)', inline: true },
        { name: 'Suggérer une fonctionnalité', value: '[Créer une issue](https://github.com/GalackQSM/Alcatraz-V14/issues)', inline: true }
      )
      .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
      .setTimestamp()
      .setColor(0x2f3136);
    
    message.channel.send({ embeds: [embed] });
  }
};
