const Command = require('../Alcatraz.js');
const { EmbedBuilder } = require('discord.js');

module.exports = class SupportServerCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'supportserveur',
      aliases: ['support', 'ss'],
      usage: 'supportserver',
      description: 'Affiche le lien d\'invitation vers le serveur de support Discord de d\'Alcatraz.',
      type: client.types.INFO
    });
  }
  run(message) {
    const embed = new EmbedBuilder()
      .setTitle('Serveur d\'assistance')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription('Cliquez [ICI](https://discord.gg/HPtTfqDdMr) pour rejoindre le serveur de support d\'Alcatraz!')
      .addFields({
        name: 'Autres Liens', 
        value: `**[Invite Alcatraz](https://discordapp.com/oauth2/authorize?client_id=${message.client.user.id}&scope=bot&permissions=2146958847) | [Github](https://github.com/GalackQSM/Alcatraz)**`
      })
      .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
      .setTimestamp()
      .setColor(0x2f3136);
    message.channel.send({ embeds: [embed] });
  }
};