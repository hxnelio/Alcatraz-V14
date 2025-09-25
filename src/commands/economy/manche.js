const Command = require('../Alcatraz.js');
const { EmbedBuilder } = require('discord.js')
const ms = require("parse-ms");
const emojis = require('../../utils/emojis.json');

module.exports = class BegCommand extends Command {
    constructor(client) {
      super(client, {
        name: 'manche',
        usage: 'manche',
        description: 'Faire la manche',
        type: client.types.ECONOMY
      });
    }
    async run (message) {
        let user = message.author;

        let timeout = 120000;
        let amount = Math.floor(Math.random() * 100) + 1;

        let beg = message.client.db.economy.selectBeg.pluck().get(user.id);

        if (beg !== null && timeout - (Date.now() - beg) > 0) {
            let time = ms(timeout - (Date.now() - beg));

            let timeEmbed = new EmbedBuilder()
                    .setColor(0x2f3136)
                    .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
                    .setTimestamp()
                .setDescription(""+emojis.error+" Vous avez déjà fais la manche récemment\nReviens dans "+time.minutes+"m "+time.seconds+"s");
            message.channel.send({embeds: [timeEmbed]})
        } else {
            let moneyEmbed = new EmbedBuilder()
                    .setColor(0x2f3136)
                    .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
                    .setTimestamp()
                .setDescription(""+emojis.success+" Tu as fais la manche et tu as reçu "+amount+" AlkaCoins");
            message.channel.send({embeds: [moneyEmbed]})
            message.client.db.economy.updateMoney.run(user.id, amount, amount)
            message.client.db.economy.updateBeg.run(user.id, Date.now(), Date.now())
        }
    }
};