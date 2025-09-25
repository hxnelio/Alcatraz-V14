const Command = require('../Alcatraz.js');
const { EmbedBuilder, ChannelType } = require('discord.js');
const moment = require('moment');
const { oneLine } = require('common-tags');
const emojis = require('../../utils/emojis.json');

const channelTypes = {
  [ChannelType.DM]: 'DM',
  [ChannelType.GuildText]: 'Texte',
  [ChannelType.GuildVoice]: 'Vocal',
  [ChannelType.GuildCategory]: 'Categorie',
  [ChannelType.GuildNews]: 'News',
  [ChannelType.GuildStore]: 'Store',
  [ChannelType.GuildNewsThread]: 'Fils News',
  [ChannelType.GuildPublicThread]: 'Fils Public',
  [ChannelType.GuildPrivateThread]: 'Fils Privé',
  [ChannelType.GuildStageVoice]: 'Salon de Scène'
};

module.exports = class ChannelInfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'saloninfo',
      aliases: ['salon', 'ci'],
      usage: 'saloninfo [#salon/ID]',
      description: oneLine`
        Récupère des informations sur le salon fourni.
        Si aucun salon n'est indiqué, le salon actuel sera utilisé.
      `,
      type: client.types.INFO,
      examples: ['saloninfo #salon']
    });
  }
  run(message, args) {
    let channel = this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (channel) {
      args.shift();
    } else channel = message.channel;
    const embed = new EmbedBuilder()
      .setTitle('Information sur le salon')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addFields(
        { name: ''+emojis.library+' Salon', value: channel.toString(), inline: true },
        { name: ''+emojis.id+' ID', value: `\`${channel.id}\``, inline: true },
        { name: ''+emojis.members+' Type', value: `\`${channelTypes[channel.type] || 'Inconnu'}\``, inline: true },
        { name: ''+emojis.members+' Membres', value: `\`${channel.members?.size || 0}\` membres`, inline: true },
        { name: ''+emojis.emojis+' Emojis', value: `\`${this.client.emojis.cache.size}\` emojis`, inline: true },
        { name: ''+emojis.bot+' Bots', value: `\`${channel.members ? Array.from(channel.members.values()).filter(b => b.user.bot).length : 0}\` bots`, inline: true },
        { name: ''+emojis.creation+' Créé le', value: `\`${moment(channel.createdAt).format('DD/MM/YYYY')}\``, inline: true }
      )
      .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
      .setTimestamp()
      .setColor(0x2f3136);
    if (channel.type === ChannelType.GuildText) {
      if (channel.topic) embed.setDescription(channel.topic);
      embed 
        .spliceFields(3, 0, { name: ''+emojis.uptime+' Slowmode', value: `\`${channel.rateLimitPerUser}\` secondes`, inline: true })
        .spliceFields(6, 0, { name: ''+emojis.nsfw+' NSFW', value: `\`${channel.nsfw}\``, inline: true });
    } else if (channel.type === ChannelType.GuildVoice) {
      embed 
        .spliceFields(0, 1, { name: 'Salon', value: `${channel.name}`, inline: true })
        .spliceFields(5, 0, { name: 'Limite utilisateur', value: `\`${channel.userLimit}\``, inline: true })
        .spliceFields(6, 0, { name: 'Plein', value: `\`${channel.full}\``, inline: true });
      const members = Array.from(channel.members.values());
      if (members.length > 0) 
        embed.addFields({ name: 'Membres rejoints', value: message.client.utils.trimArray(members).join(' ') });
    }
    message.channel.send({ embeds: [embed] });
  }
};