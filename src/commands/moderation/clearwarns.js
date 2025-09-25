const Command = require('../Alcatraz.js');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { oneLine } = require('common-tags');

module.exports = class ClearWarnsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'clearwarns',
      usage: 'clearwarns <@membre/ID> [raison]',
      description: 'Efface tous les avertissements du membre fourni.',
      type: client.types.MOD,
      userPermissions: [PermissionFlagsBits.KickMembers],
      examples: ['clearwarns @Henelio']
    });
  }
  run(message, args) {

    const member = this.getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);
    if (!member)
      return this.sendErrorMessage(message, 0, 'Veuillez mentionner un utilisateur ou fournir un ID utilisateur valide');
    if (member === message.member) 
      return this.sendErrorMessage(message, 0, 'Vous ne pouvez pas effacer vos propres avertissements'); 
    if (member.roles.highest.position >= message.member.roles.highest.position)
      return this.sendErrorMessage(message, 0, 'Vous ne pouvez pas effacer les avertissements d\'une personne ayant un rôle égal ou supérieur');

    let reason = args.slice(1).join(' ');
    if (!reason) reason = '`Aucune raison fourni`';
    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';
    
    message.client.db.users.updateWarns.run('', member.id, message.guild.id);

    const embed = new EmbedBuilder()
      .setTitle('Suppression de tous les avertissements')
      .setDescription(`Les avertissements de ${member} ont été effacés avec succès.`)
      .addFields(
        { name: 'Par', value: message.member.toString(), inline: true },
        { name: 'Membre', value: member.toString(), inline: true },
        { name: 'Nombre d\'avertissement', value: '`0`', inline: true },
        { name: 'Raison', value: reason }
      )
      .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
      .setTimestamp()
      .setColor(0x2f3136);
    message.channel.send({ embeds: [embed] });
    message.client.logger.info(oneLine`
      ${message.guild.name}: ${message.author.tag} a effacé les avertissements de ${member.user.tag}
    `);
    
    this.sendModLogMessage(message, reason, { Member: member, 'Nombre d\'avertissements': '`0`' });
  }
};