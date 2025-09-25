const Command = require('../Alcatraz.js');
const { EmbedBuilder } = require('discord.js')
const slotItems = ["🍇", "🍉", "🍌", "🍎", "🍒"];

module.exports = class WeeklyCommand extends Command {
    constructor(client) {
      super(client, {
        name: 'slots',
        usage: 'slots 300',
        description: 'Tentez votre chance à une machine à sous. Attention, je suis très doué pour voler votre argent.',
        type: client.types.ECONOMY
      });
    }
    async run (message, args) {
        let user = message.author;
        let moneydb = message.client.db.economy.selectMoney.pluck().get(user.id) || 0;
        let money = parseInt(args[0]);
        let win = false;

    
        if (!money) return message.reply("Vous devez parier quelque chose.");
        if (money > moneydb) return message.reply(`Vous n'avez que ${moneydb} AlkaCoins, n'essayez pas de mentir `);
    
        let number = []
        for (let i = 0; i < 3; i++) { number[i] = Math.floor(Math.random() * slotItems.length); }
    
        if (number[0] == number[1] && number[1] == number[2])  { 
            money *= 9
            win = true;
        } else if (number[0] == number[1] || number[0] == number[2] || number[1] == number[2]) { 
            money *= 3
            win = true;
        }
        if (win) {
            let slotsEmbed1 = new EmbedBuilder()
                .setDescription(`${slotItems[number[0]]} | ${slotItems[number[1]]} | ${slotItems[number[2]]}\n\nVous avez gagné ${money} AlkaCoins`)
        .setColor(0x2f3136)
        .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
        .setTimestamp()
            message.channel.send({embeds: [slotsEmbed1]})
            message.client.db.economy.updateMoney.run(user.id, money, money)
        } else {
            let slotsEmbed = new EmbedBuilder()
                .setDescription(`${slotItems[number[0]]} | ${slotItems[number[1]]} | ${slotItems[number[2]]}\n\nVous avez perdu ${money} AlkaCoins`)
        .setColor(0x2f3136)
        .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
        .setTimestamp()
            message.channel.send({embeds: [slotsEmbed]})
            message.client.db.economy.subtractMoney.run(user.id, money)
        }
    
    }
    }