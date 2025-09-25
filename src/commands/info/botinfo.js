                                                                       
const Command = require('../Alcatraz.js');
const { EmbedBuilder } = require('discord.js');
const pkg = require(__basedir + '/package.json');
const moment = require('moment');
const emojis = require('../../utils/emojis.json');
const { oneLine, stripIndent } = require('common-tags');

module.exports = class BotInfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'botinfo',
      aliases: ['bot', 'bi'],
      usage: 'botinfo',
      description: 'Récupère les informations et les statistiques de Alcatraz.',
      type: client.types.INFO
    });
  }
  run(message) {
    const owner = message.client.users.cache.get(message.client.ownerId);
    const prefix = message.client.db.settings.selectPrefix.pluck().get(message.guild.id);
    const d = moment.duration(message.client.uptime);
    const days = (d.days() == 1) ? `${d.days()} jour` : `${d.days()} jours`;
    const hours = (d.hours() == 1) ? `${d.hours()} heure` : `${d.hours()} heures`;
    const embed = new EmbedBuilder()
      .setTitle('Informations sur Alcatraz')
      .setThumbnail(message.guild.iconURL())
      .setDescription(oneLine`
        Alcatraz est un bot Discord riche en fonctionnalités conçu pour la personnalisation.
        Elle est livrée avec une variété de commandes et un
        multitude de paramètres qui peuvent être adaptés à vos besoins spécifiques.
      `)
      .addFields(
        { name: ''+emojis.pseudo+' Pseudo', value: message.client.user.username, inline: true },
        { name: ''+emojis.discriminateur+' Discriminateur', value: `\`#${message.client.user.discriminator}\``, inline: true },
        { name: ''+emojis.id+' ID', value: `\`${message.client.user.id}\``, inline: true },
        { name: ''+emojis.surnom+' Surnom', value: (message.guild.members.me.nickname) ? message.guild.members.me.nickname : '`Aucun`', inline: true },
        { name: ''+emojis.prefix+' Prefix', value: `\`${prefix}\``, inline: true },
        { name: ''+emojis.members+' Membres détectés', value: `\`${message.client.users.cache.size - 1}\``, inline: true },
        { name: ''+emojis.servers+' Serveurs', value: `\`${message.client.guilds.cache.size}\``, inline: true },
        { name: ''+emojis.owner+' Propriétaire', value: owner.toString(), inline: true },
        { name: ''+emojis.uptime+' Disponibilité', value: `\`${days}\` et \`${hours}\``, inline: true },
        { name: ''+emojis.version+' Version actuelle', value: `\`${pkg.version}\``, inline: true },
        { name: ''+emojis.library+' Library/Environment', value: 'Discord.js 14.22.1\nNode.js 18.x', inline: true },
        { name: ''+emojis.database+' Database', value: 'SQLite', inline: true }
      )
      .addFields({ 
        name: '**'+emojis.liens+' Liens**', 
        value: '**[Ajouter Alcatraz](https://discordapp.com/oauth2/authorize?client_id=774652242787041310&scope=bot&permissions=2146958847) | ' +
        '[Alcatraz Empire](https://discord.gg/HPtTfqDdMr) | ' +
        '[Github](https://github.com/GalackQSM/Alcatraz)**'
      })
        .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
        .setTimestamp()
        .setColor(0x2f3136);
    message.channel.send({ embeds: [embed] });
  }
};