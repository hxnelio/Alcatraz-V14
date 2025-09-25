const Command = require('../Alcatraz.js');
const { EmbedBuilder } = require('discord.js')
const emojis = require('../../utils/emojis.json');

module.exports = class DepositCommand extends Command {
    constructor(client) {
      super(client, {
        name: 'deposit',
        aliases: ['dep'],
        usage: 'deposit 100',
        description: 'Déposer vos AlkaCoins dans la banque',
        type: client.types.ECONOMY
      });
    }
    
    async run (message, args) {

let user = message.author;

let member2 = message.client.db.economy.selectMoney.pluck().get(user.id) || 0;

if (args.join(' ').toLocaleLowerCase() == 'all') {
    let money = message.client.db.economy.selectMoney.pluck().get(user.id) || 0;
    let embed = new EmbedBuilder()
        .setColor(0x2f3136)
        .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
        .setTimestamp()
      .setDescription(""+emojis.error+" **Vous n'avez pas d'AlkaCoins à déposer!**")
    if (!money) return message.channel.send({embeds: [embed]})
    message.client.db.economy.subtractMoney.run(user.id, money)
    message.client.db.economy.updateBank.run(user.id, money, money)
    let embed5 = new EmbedBuilder()
        .setColor(0x2f3136)
        .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
        .setTimestamp()
        .setDescription(""+emojis.success+" Vous avez déposé toutes vos AlkaCoins de votre portefeuille"); 
    message.channel.send({embeds: [embed5]})

} else {

    let embed2 = new EmbedBuilder() 
        .setColor(0x2f3136)
        .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
        .setTimestamp()
        .setDescription(""+emojis.error+" Précisez un montant à déposer!");

    if (!args[0]) {
        return message.channel.send({embeds: [embed2]})
    }
    let embed6 = new EmbedBuilder()
        .setColor(0x2f3136)
        .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
        .setTimestamp()
        .setDescription(""+emojis.error+" Votre montant n'est pas un nombre!")

    if(isNaN(args[0])) {
        return message.channel.send({embeds: [embed6]})
    }
    let embed3 = new EmbedBuilder()
        .setColor(0x2f3136)
        .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
        .setTimestamp()
        .setDescription(""+emojis.error+" Vous ne pouvez pas déposer d'AlkaCoins négatif!");

    if (message.content.includes('-')) {
        return message.channel.send({embeds: [embed3]})
    }
    let embed4 = new EmbedBuilder()
        .setColor(0x2f3136)
        .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
        .setTimestamp()
        .setDescription(""+emojis.error+" Vous n'avez pas beaucoup d'AlkaCoins dans le portefeuille!");

    if (member2 < args[0]) {
        return message.channel.send({embeds: [embed4]})
    }

    let embed5 = new EmbedBuilder()
        .setColor(0x2f3136)
        .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
        .setTimestamp()
        .setDescription(""+emojis.success+" Vous avez déposé vos "+args[0]+" AlkaCoins dans de votre banque!");

    message.channel.send({embeds: [embed5]})
    message.client.db.economy.subtractMoney.run(user.id, parseInt(args[0]))
    message.client.db.economy.updateBank.run(user.id, parseInt(args[0]), parseInt(args[0]))
}
}
}