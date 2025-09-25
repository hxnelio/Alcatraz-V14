const Command = require('../Alcatraz.js');
const { EmbedBuilder } = require('discord.js')
const ms = require("parse-ms");
const emojis = require('../../utils/emojis.json');
const Jwork = require('../../utils/works.json');
const JworkR = Jwork[Math.floor(Math.random() * Jwork.length)];

module.exports = class WorkCommand extends Command {
    constructor(client) {
      super(client, {
        name: 'work',
        usage: 'work',
        description: 'travailler pour quelques pièces',
        type: client.types.ECONOMY
      });
    }
    async run (message) {

            let user = message.author;
            let author = message.client.db.economy.selectWork.pluck().get(user.id);
    
            let timeout = 1800000;
    
            if (author !== null && timeout - (Date.now() - author) > 0) {
                let time = ms(timeout - (Date.now() - author));
    
                let timeEmbed = new EmbedBuilder()
                    .setColor(0x2f3136)
                    .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
                    .setTimestamp()
                    .setDescription(""+emojis.error+" Vous avez déjà travaillé récemment\nRéessayez dans `"+time.minutes+"m "+time.seconds+"s` ");
                message.channel.send({embeds: [timeEmbed]})
            } else {
                let amount = Math.floor(Math.random() * 80) + 1;
                let embed1 = new EmbedBuilder()
                    .setColor(0x2f3136)
                    .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
                    .setTimestamp()
                    .setDescription(""+emojis.success+" **"+JworkR+"\n"+amount+"** AlkaCoins")
                message.channel.send({embeds: [embed1]})
    
                message.client.db.economy.updateWork.run(user.id, Date.now(), Date.now())
                message.client.db.economy.updateMoney.run(user.id, amount, amount)
            };
        }
    }