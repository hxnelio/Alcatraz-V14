const Command = require('../Alcatraz.js');
const { EmbedBuilder, ActivityType } = require('discord.js');
const moment = require('moment');
const emojis = require('../../utils/emojis.json');
const statuses = {
  online: 'En Ligne',
  idle: 'Inactif',
  offline: 'Hors Ligne',
  dnd: 'Ne pas déranger'
};
const flags = {
  DISCORD_EMPLOYEE: ''+emojis.discord_employee+' `Staff Discord`',
  DISCORD_PARTNER: ''+emojis.discord_partner+' `Partenaire Discord`',
  BUGHUNTER_LEVEL_1: ''+emojis.bughunter_level_1+' `Chasseur de bugs (Level 1)`',
  BUGHUNTER_LEVEL_2: ''+emojis.bughunter_level_2+' `Chasseur de bugs (Level 2)`',
  HYPESQUAD_EVENTS: ''+emojis.hypesquad_events+' `Événements HypeSquad`',
  HOUSE_BRAVERY: ''+emojis.house_bravery+' `Maison de la bravoure`',
  HOUSE_BRILLIANCE: ''+emojis.house_brilliance+' `Maison de la brillance`',
  HOUSE_BALANCE: ''+emojis.house_balance+' `Maison de l\'équilibre`',
  EARLY_SUPPORTER: ''+emojis.early_supporter+' `Premier partisan`',
  TEAM_USER: 'Utilisateur d\'équipe',
  SYSTEM: 'Système',
  VERIFIED_BOT: ''+emojis.verified_bot+' `Bot vérifié`',
  VERIFIED_DEVELOPER: ''+emojis.verified_developer+' `Développeur de bot vérifié`'
};

module.exports = class UserInfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'userinfo',
      aliases: ['whois', 'user', 'ui'],
      usage: 'userinfo [@membre/ID]',
      description: 'Récupère les informations d\'un membre. Si aucun utilisateur n\'est indiqué, vos propres informations seront affichées.',
      type: client.types.INFO,
      examples: ['userinfo @Alcatraz']
    });
  }
  async run(message, args) {
    const member =  this.getMemberFromMention(message, args[0]) || 
      message.guild.members.cache.get(args[0]) || 
      message.member;
    const userFlags = (await member.user.fetchFlags()).toArray();
    const activities = [];
    let customStatus;
    for (const activity of member.presence?.activities.values() || []) {
      switch (activity.type) {
        case ActivityType.Playing:
          activities.push(`Joue **${activity.name}**`);
          break;
        case ActivityType.Listening:
          if (member.user.bot) activities.push(`Ecoute **${activity.name}**`);
          else activities.push(`Ecoute **${activity.details}** par **${activity.state}**`);
          break;
        case ActivityType.Watching:
          activities.push(`Regarde **${activity.name}**`);
          break;
        case ActivityType.Streaming:
          activities.push(`Stream **${activity.name}**`);
          break;
        case ActivityType.CustomStatus:
          customStatus = activity.state;
          break;
      }
    }
    
    let roles = message.client.utils.trimArray(Array.from(member.roles.cache.values()).filter(r => !r.name.startsWith('#')));
    roles = message.client.utils.removeElement(roles, message.guild.roles.everyone)
      .sort((a, b) => b.position - a.position).join(' ');
    
    const embed = new EmbedBuilder()
      .setTitle(`Information sur le membre: ${member.displayName} `)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: ''+emojis.pseudo+' Pseudo', value: member.user.username, inline: true },
        { name: ''+emojis.discriminateur+' Discriminateur', value: `\`#${member.user.discriminator}\``, inline: true },
        { name: ''+emojis.id+' ID', value: `\`${member.id}\``, inline: true },
        { name: ''+emojis.surnom+' Surnom', value: (member.nickname) ? member.nickname : '`Aucun`', inline: true },
        { name: ''+emojis.statut+' Statut', value: statuses[member.presence?.status] || 'Hors Ligne', inline: true },
        { name: ''+emojis.roles+' Rôle de couleur', value: member.roles.color?.toString() || '`Aucun`', inline: true },
        { name: ''+emojis.roles+' Rôle le + élevé', value: member.roles.highest.toString(), inline: true },
        { name: ''+emojis.join_serveur+' Rejoint le serveur le', value: moment(member.joinedAt).format('DD/MM/YYYY'), inline: true },
        { name: ''+emojis.join_discord+' Rejoint Discord le', value: moment(member.user.createdAt).format('DD/MM/YYYY'), inline: true },
        { name: ''+emojis.roles+' Rôles', value: roles }
      )
      .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
      .setTimestamp()
      .setColor(0x2f3136);
    if (activities.length > 0) embed.setDescription(activities.join('\n'));
    if (customStatus) embed.spliceFields(0, 0, { name: 'Statut personnalisé', value: customStatus });
    if (userFlags.length > 0) embed.addFields({ name: ''+emojis.badge+' Badges', value: userFlags.map(flag => flags[flag]).join('\n') });
    message.channel.send({ embeds: [embed] });
  }
};