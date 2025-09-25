const Command = require('../Alcatraz.js');
const { EmbedBuilder } = require('discord.js')
const ms = require('parse-ms')
const emojis = require('../../utils/emojis.json');

module.exports = class BalanceCommand extends Command {
    constructor(client) {
      super(client, {
        name: 'daily',
        usage: 'daily',
        description: 'Récupérer l\'argent du jour',
        type: client.types.ECONOMY
      });
    }
    
    async run (message, args) {
let user = message.author;

let timeout = 86400000;
let amount = Math.floor(Math.random() * 500) + 1;

let daily = message.client.db.economy.selectDaily.pluck().get(user.id);

if (daily !== null && timeout - (Date.now() - daily) > 0) {
    let time = ms(timeout - (Date.now() - daily));

    let timeEmbed = new EmbedBuilder()
        .setAuthor({ name: "Déjà réclamer!" })
        .setColor(0x2f3136)
        .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
        .setTimestamp()
        .setDescription(`Tu as déjà demandé aujourd'hui, reviens dans: **${time.hours}heure(s), ${time.minutes}minute(s), ${time.seconds}seconde(s)**`);
    message.channel.send({embeds: [timeEmbed]})
} else {
    let moneyEmbed = new EmbedBuilder()
        .setColor(0x2f3136)
        .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
        .setTimestamp()
        .setDescription(""+emojis.success+" Vous avez récupéré votre récompense quotidienne de "+amount+" AlkaCoins");
    message.channel.send({embeds: [moneyEmbed]})
    message.client.db.economy.updateMoney.run(user.id, amount, amount)
    message.client.db.economy.updateDaily.run(user.id, Date.now(), Date.now())
}
}
}