const Command = require('../Alcatraz.js');
const { EmbedBuilder } = require('discord.js')
const ms = require("parse-ms");
const emojis = require('../../utils/emojis.json');

module.exports = class WeeklyCommand extends Command {
    constructor(client) {
      super(client, {
        name: 'dailyweek',
        usage: 'dailyweek',
        description: 'Réclamez vos AlkaCoins hebdomadaires',
        type: client.types.ECONOMY
      });
    }
    async run (message) {
        let user = message.author;
        let timeout = 604800000;
        let amount = Math.floor(Math.random() * 1000) + 1;

        let weekly = message.client.db.economy.selectWeekly.pluck().get(user.id);

        if (weekly !== null && timeout - (Date.now() - weekly) > 0) {
            let time = ms(timeout - (Date.now() - weekly));

            let timeEmbed = new EmbedBuilder()
                .setAuthor({ name: 'Déjà réclamer!' })
                .setColor(0x2f3136)
                .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
                .setTimestamp()
                .setDescription(`Tu as déjà demandé aujourd'hui, reviens dans **${time.days}jour(s), ${time.hours}heure(s), ${time.minutes}minute(s)**`);
            message.channel.send({embeds: [timeEmbed]})
        } else {
            let embed = new EmbedBuilder()
                .setAuthor({ name: `Voici vos pièces hebdomadaires, ${message.member.displayName}` })
                .setColor(0x2f3136)
                .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
                .setTimestamp()
                .setDescription(""+emojis.success+" Vos "+amount+" AlkaCoins ont été placées dans votre portefeuille"); 
            message.channel.send({embeds: [embed]})
            message.client.db.economy.updateMoney.run(user.id, amount, amount)
            message.client.db.economy.updateWeekly.run(user.id, Date.now(), Date.now())
        }
    }
}