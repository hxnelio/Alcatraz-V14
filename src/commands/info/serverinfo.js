const Command = require('../Alcatraz.js');
const { EmbedBuilder, ChannelType } = require('discord.js');
const moment = require('moment');
const emojis = require('../../utils/emojis.json');
const region = {
  'us-central': 'US Central :flag_us:',
  'us-east': 'US East :flag_us:',
  'us-south': 'US South :flag_us:',
  'us-west': 'US West :flag_us:',
  'europe': 'Europe :flag_eu:',
  'singapore': 'Singapour :flag_sg:',
  'japan': 'Japon :flag_jp:',
  'russia': 'Russie :flag_ru:',
  'hongkong': 'Hong Kong :flag_hk:',
  'brazil': 'Brésil :flag_br:',
  'sydney': 'Sydney :flag_au:',
  'southafrica': 'Afrique du sud :flag_za:'
};
const verificationLevels = {
  NONE: 'Aucune',
  LOW: 'Faible',
  MEDIUM: 'Moyens',
  HIGH: 'Elevé',
  VERY_HIGH: 'Très élevé'
};

module.exports = class ServerInfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'serverinfo',
      aliases: ['server', 'si'],
      usage: 'serverinfo',
      description: 'Récupère des informations et des statistiques sur le serveur.',
      type: client.types.INFO
    });
  }
  run(message) {

    let roles = message.client.utils.trimArray(
      Array.from(message.guild.roles.cache.values()).filter(r => !r.name.startsWith('#'))
    );
    roles = message.client.utils.removeElement(roles, message.guild.roles.everyone);
    roles.sort((a, b) => b.position - a.position);

    const textChannels = message.client.utils.trimArray(
      Array.from(message.guild.channels.cache.values()).filter(c => c.type === ChannelType.GuildText).sort((a, b) => a.rawPosition - b.rawPosition)
    );
    
    const voiceChannels = message.client.utils.trimArray(
      Array.from(message.guild.channels.cache.values()).filter(c => c.type === ChannelType.GuildVoice)
    );
    
    const embed = new EmbedBuilder()
      .setTitle(`Information du serveur: ${message.guild.name}`)
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addFields(
        { name: ''+emojis.id+' ID', value: `\`${message.guild.id}\``, inline: true },
        { name: ''+emojis.owner+' Propriétaire', value: message.guild.members.cache.get(message.guild.ownerId)?.user?.tag || 'Inconnu', inline: true },
        { name: ''+emojis.members+' Membres', value: `\`${message.guild.memberCount}\` membres`, inline: true },
        { name: ''+emojis.bot+' Bots', value: `\`${Array.from(message.guild.members.cache.values()).filter(b => b.user.bot).length}\` bots`, inline: true },
        { name: ''+emojis.roles+' Nombre de rôles', value: `\`${message.guild.roles.cache.size - 1}\` rôles`, inline: true },
        { name: ''+emojis.text+' Salon texte', value: `\`${textChannels.length}\` salons`, inline: true },
        { name: ''+emojis.voice+' Salon vocaux', value: `\`${voiceChannels.length}\` salons`, inline: true },
        { name: ''+emojis.verification+' Vérification', value: `\`${verificationLevels[message.guild.verificationLevel]}\``, inline: true },
        { name: ''+emojis.afk+' Salons AFK', 
          value: (message.guild.afkChannel) ? `${message.guild.afkChannel.name}` : '`Aucun`', inline: true
        },
        { name: ''+emojis.afk+' AFK Temps libre', 
          value: (message.guild.afkChannel) ? 
            `\`${moment.duration(message.guild.afkTimeout * 1000).asMinutes()} minutes\`` : '`Aucun`', 
          inline: true
        },
        { name: ''+emojis.creation+' Créé le', value: `\`${moment(message.guild.createdAt).format('DD/MM/YYYY')}\``, inline: true },
        { name: ''+emojis.boost+' Nombre boosts', value: `\`${message.guild.premiumSubscriptionCount || 0}\` Boosts`, inline: true },
        { name: ''+emojis.roles+' Les rôles', value: roles.join(' ') },
        { name: ''+emojis.text+' Salons textes', value: textChannels.join(' ') || '`Aucun`' }
      )
      .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
      .setTimestamp()
      .setColor(0x2f3136);
    if (message.guild.description) embed.setDescription(message.guild.description);
    if (message.guild.bannerURL) embed.setImage(message.guild.bannerURL({ dynamic: true }));
    message.channel.send({ embeds: [embed] });
  }
};