const Command = require('../Alcatraz.js');
const { EmbedBuilder } = require('discord.js');

module.exports = class KissCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'kiss',
      aliases: ['embrasser'],
      usage: 'kiss',
      description: 'Embrasser une personne.',
      type: client.types.FUN,
      examples: ['kiss @GalackQSM']
    });
  }

    async run(message, args, level) {

        const user = message.mentions.members.first();
        if (!user) return message.reply("Vous devez mentionner une personne !");

        const member = message.member;


        const kiss = [
            `https://cdn.nekos.life/kiss/kiss_001.gif`,
            `https://cdn.nekos.life/kiss/kiss_102.gif`,
            `https://cdn.nekos.life/kiss/kiss_131.gif`,
            `https://cdn.nekos.life/kiss/kiss_050.gif`,
            `https://cdn.nekos.life/kiss/kiss_060.gif`,
            `https://cdn.nekos.life/kiss/kiss_072.gif`,
            `https://cdn.nekos.life/kiss/kiss_091.gif`,
            `https://cdn.nekos.life/kiss/kiss_021.gif`,
            `https://cdn.nekos.life/kiss/kiss_064.gif`,
            `https://cdn.nekos.life/kiss/kiss_083.gif`
        ]

         const embed = new EmbedBuilder()
        .setDescription(`**${member.user.username}** viens d'embrasser **${user.user.username}** :kiss:`)
        .setImage(kiss[Math.floor(Math.random() * kiss.length)])
        .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
        .setTimestamp()
        .setColor(0x2f3136)

        message.channel.send({ embeds: [embed] })

    }
};