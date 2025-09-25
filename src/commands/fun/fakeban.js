const Command = require('../Alcatraz.js');
const { EmbedBuilder } = require('discord.js');

module.exports = class Fakeban extends Command {
  constructor (client) {
    super(client, {
      name: 'fakeban',
      usage: 'fakeban @membre',
      description: 'Banni une membre pour rigoler',
      type: client.types.FUN,
      examples: ['fakeban @Henelio']

    });
  }

    async run(message, args, level) { 
        const user = message.mentions.members.first();
        if (!user) return message.reply("Vous devez mentionner une personne !");

        const member = message.member;
        const fakeban = [
            `https://media1.tenor.com/images/459e6388894ecf845ee7db65476d153e/tenor.gif`
        ]
         const embed = new EmbedBuilder()
        .setDescription(`**${member.user.username}** vous avez banni **${user.user.username}**`)
        .setImage(fakeban[Math.floor(Math.random() * fakeban.length)])
        .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
        .setTimestamp()
        .setColor(0x2f3136)

        message.channel.send({ embeds: [embed] })
    }
};