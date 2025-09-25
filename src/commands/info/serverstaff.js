const Command = require('../Alcatraz.js');
const { EmbedBuilder } = require('discord.js');

module.exports = class ServerStaffCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'serverstaff',
      aliases: ['staff'],
      usage: 'serverstaff',
      description: 'Affiche une liste de tous les modérateurs et administrateurs actuels du serveur.',
      type: client.types.INFO
    });
  }
  run(message) {
    
    const modRoleId = message.client.db.settings.selectModRoleId.pluck().get(message.guild.id);
    let modRole, mods;
    if (modRoleId) modRole = message.guild.roles.cache.get(modRoleId);
    
    const adminRoleId = message.client.db.settings.selectAdminRoleId.pluck().get(message.guild.id);
    let adminRole, admins;
    if (adminRoleId) adminRole = message.guild.roles.cache.get(adminRoleId);
  
    let modList = [], adminList = [];

    if (modRole) modList = Array.from(message.guild.members.cache.filter(m => {
      if (m.roles.cache.find(r => r === modRole)) return true;
    }).sort((a, b) => (a.joinedAt > b.joinedAt) ? 1 : -1).values());

    if (modList.length > 0) mods = message.client.utils.trimStringFromArray(modList, 1024);
    else mods = 'Aucun modérateur trouvé.';
    
    if (adminRole) adminList = Array.from(message.guild.members.cache.filter(m => {
      if (m.roles.cache.find(r => r === adminRole)) return true;
    }).sort((a, b) => (a.joinedAt > b.joinedAt) ? 1 : -1).values());

    if (adminList.length > 0) admins = message.client.utils.trimStringFromArray(adminList, 1024);
    else admins = 'Aucun administrateur trouvé.';
    

    const embed = new EmbedBuilder()
      .setTitle(`Liste du staff du serveur [${modList.length + adminList.length}]`)
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addFields(
        { name: `Administrateur(s) [${adminList.length}]`, value: admins, inline: true },
        { name: `Modérateur(s) [${modList.length}]`, value: mods, inline: true }
      )
      .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
      .setTimestamp()
      .setColor(0x2f3136);
    message.channel.send({ embeds: [embed] });
  }
};