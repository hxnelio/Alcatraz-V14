const Command = require('../Alcatraz.js');
const { EmbedBuilder } = require('discord.js');
const moment = require('moment');
const { mem, cpu, os } = require('node-os-utils');
const { stripIndent } = require('common-tags');
const { utc } = require("moment");
const emojis = require('../../utils/emojis.json');

module.exports = class StatsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'stats',
      aliases: ['statistics', 'metrics'],
      usage: 'stats',
      description: 'Avoir les stats du bot.',
      type: client.types.INFO
    });
  }
  async run(message) {
    const d = moment.duration(message.client.uptime);
    const days = (d.days() == 1) ? `${d.days()} jour` : `${d.days()} jours`;
    const hours = (d.hours() == 1) ? `${d.hours()} heure` : `${d.hours()} heures`;
    const clientStats = stripIndent`
      **• Serveurs:** ${message.client.guilds.cache.size}
      **• Membres:** ${message.client.users.cache.size}
      **• Salons:** ${message.client.channels.cache.size}
      **• Emojis:** ${message.client.emojis.cache.size}
      **• Ping:** ${Math.round(message.client.ws.ping)}ms
      **• En ligne depuis:** ${days} et ${hours}
    `;
    const { totalMemMb, usedMemMb } = await mem.info();
    const serverStats = stripIndent`
      **• Modèle:** ${cpu.model()}
      **• Cores:** ${cpu.count()}
      **• CPU:** ${await cpu.usage()} %
      **• RAM Total:** ${totalMemMb} MB
      **• RAM:** ${usedMemMb} MB 
      **• DiscordJS:** 14.22.1 
      **• NodeJS:** ${process.versions.node} MB 
    `;
    const embed = new EmbedBuilder()
      .setTitle('Statistiques d\'Alcatraz')
      .setDescription(`● **Alcatraz** a été créé par **GalackQSM#0895**\n● **Alcatraz** à été crée le **${utc(message.client.user.createdTimestamp).format('DD/MM/YYYY à HH:mm:ss')}**\n● **Alcatraz** est un bot open source développé par **GalackQSM#0895**!\n● **Alcatraz** à était recréer et recoder par **Henelio** avec **Discord.js v14.22.1**`)
      .addFields(
        { name: 'Commandes:', value: `\`${message.client.commands.size}\` commandes`, inline: true },
        { name: 'Aliases:', value: `\`${message.client.aliases.size}\` aliases`, inline: true },
        { name: 'Catégories:', value: `\`${Object.keys(message.client.types).length}\` catégories`, inline: true },
        { name: '__Alcatraz__', value: `${clientStats}` },
        { name: '__Serveur__', value: `${serverStats}` },
        { 
          name: '**'+emojis.liens+' Liens**', 
          value: '**[Ajouter Alcatraz](https://discordapp.com/oauth2/authorize?client_id=' + message.client.user.id + '&scope=bot&permissions=2146958847) | ' +
            '[Alcatraz Empire](https://discord.gg/HPtTfqDdMr) | ' +
            '[Github](https://github.com/GalackQSM/Alcatraz)**'
        }
      )
      .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
      .setTimestamp()
      .setColor(0x2f3136);
    message.channel.send({ embeds: [embed] });
  }
};
function formatSizeUnits(bytes) {
  if (bytes >= 1073741824) { bytes = (bytes / 1073741824).toFixed(2) + " GB"; }
  else if (bytes >= 1048576) { bytes = (bytes / 1048576).toFixed(2) + " MB"; }
  else if (bytes >= 1024) { bytes = (bytes / 1024).toFixed(2) + " KB"; }
  else if (bytes > 1) { bytes = bytes + " bytes"; }
  else if (bytes == 1) { bytes = bytes + " byte"; }
  else { bytes = "0 bytes"; }
  return bytes;
}
function convertMS(milliseconds) {
  var day, hour, minute, seconds;
  seconds = Math.floor(milliseconds / 1000);
  minute = Math.floor(seconds / 60);
  seconds = seconds % 60;
  hour = Math.floor(minute / 60);
  minute = minute % 60;
  day = Math.floor(hour / 24);
  hour = hour % 24;
  return { day: day, hour: hour, minute: minute, seconds: seconds };
}