const Command = require('../Alcatraz.js');
const { EmbedBuilder } = require('discord.js');
const moment = require('moment');

module.exports = class UptimeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'uptime',
      aliases: ['up'],
      usage: 'uptime',
      description: 'Récupère la disponibilité actuelle de d\'Alcatraz.',
      type: client.types.INFO
    });
  }
  run(message) {
    const d = moment.duration(message.client.uptime);
    const days = (d.days() == 1) ? `${d.days()} jour` : `${d.days()} jours`;
    const hours = (d.hours() == 1) ? `${d.hours()} heure` : `${d.hours()} heures`;
    const minutes = (d.minutes() == 1) ? `${d.minutes()} minute` : `${d.minutes()} minutes`;
    const seconds = (d.seconds() == 1) ? `${d.seconds()} seconde` : `${d.seconds()} secondes`;
    const date = moment().subtract(d, 'ms').format('DD/MM/YYYY');
    const embed = new EmbedBuilder()
      .setTitle('Temps de disponibilité de d\'Alcatraz')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`\`${days}\`, \`${hours}\`, \`${minutes}\`, et \`${seconds}\``)
      .addFields({ name: 'Date de la dernière mise à jour', value: date })
      .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
      .setTimestamp()
      .setColor(0x2f3136);
    message.channel.send({ embeds: [embed] });
  }
};