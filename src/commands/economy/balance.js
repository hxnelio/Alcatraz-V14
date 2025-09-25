const Command = require('../Alcatraz.js');
const { EmbedBuilder } = require('discord.js');

module.exports = class BalanceCommand extends Command {
    constructor(client) {
      super(client, {
        name: 'balance',
        aliases: ['bal'],
        usage: 'balance [@membre]',
        description: 'Vérifier votre solde de points',
        type: client.types.ECONOMY
      });
    }
    async run (message, args) {
        let user =
        message.mentions.members.first() ||
        message.guild.members.cache.get(args[0]) ||
        message.guild.members.cache.find(
          r =>
            r.user.username.toLowerCase() === args.join(" ").toLocaleLowerCase()
        ) ||
        message.guild.members.cache.find(
          r => r.displayName.toLowerCase() === args.join(" ").toLocaleLowerCase()
        ) ||
        message.member;
  
      // Récupérer les points depuis la base de données SQLite
      const points = message.client.db.users.selectPoints.pluck().get(user.id, message.guild.id) || 0;
      const totalPoints = message.client.db.users.selectTotalPoints.pluck().get(user.id, message.guild.id) || 0;
  
      if (user) {
        let moneyEmbed = new EmbedBuilder()
          .setColor(0x2f3136)
          .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
          .setTimestamp()
          .setDescription(
            `**${user.user.username}, voici votre solde:**\n\n\`Points actuels:\` ${points} points\n\`Total des points:\` ${totalPoints} points`
          );
        message.channel.send({embeds: [moneyEmbed]});
      } else {
        return message.channel.send("**Entrez un membre valide!**");
      }
    }
  };
