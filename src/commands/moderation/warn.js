const Command = require('../Alcatraz.js');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const moment = require('moment');

module.exports = class WarnCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'warn',
      usage: 'warn <@membre/ID> [raison]',
      description: 'Avertir un membre de votre serveur.',
      type: client.types.MOD,
      clientPermissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.KickMembers],
      userPermissions: [PermissionFlagsBits.KickMembers],
      examples: ['warn @Henelio']
    });
  }
  run(message, args) {

    const member = this.getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);
    if (!member) 
      return this.sendErrorMessage(message, 0, 'Veuillez mentionner un utilisateur ou fournir un ID utilisateur valide');
    if (member === message.member) 
      return this.sendErrorMessage(message, 0, 'Vous ne pouvez pas vous prévenir'); 
    if (member.roles.highest.position >= message.member.roles.highest.position) 
      return this.sendErrorMessage(message, 0, 'Vous ne pouvez pas avertir quelqu\'un avec un rôle égal ou supérieur');

    const autoKick = message.client.db.settings.selectAutoKick.pluck().get(message.guild.id); 

    let reason = args.slice(1).join(' ');
    if (!reason) reason = '`Aucune raison fourni`';
    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';

    let warns = message.client.db.users.selectWarns.pluck().get(member.id, message.guild.id) || { warns: [] };
    if (typeof(warns) == 'string') warns = JSON.parse(warns);
    const warning = {
      mod: message.member.id,
      date:  moment().format('DD/MM/YYYY'),
      reason: reason
    };

    warns.warns.push(warning);
    
    message.client.db.users.updateWarns.run(JSON.stringify(warns), member.id, message.guild.id);

    const embed = new EmbedBuilder()
      .setTitle('Un membre viens d\'être averti')
        .setDescription(`Le membre ${member} a réçu un avertissement.`)
      .addFields(
        { name: 'Par', value: message.member.toString(), inline: true },
        { name: 'Membre', value: member.toString(), inline: true },
        { name: 'Nombre d\'avertissement', value: `\`${warns.warns.length}\``, inline: true },
        { name: 'Raison', value: reason }
      )
      .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
      .setTimestamp()
      .setColor(0x2f3136);
    message.channel.send({ embeds: [embed] });
    message.client.logger.info(`${message.guild.name}: ${message.author.tag} a averti ${member.user.tag}`);
    
    this.sendModLogMessage(message, reason, { Member: member, 'Warn Count': `\`${warns.warns.length}\`` });

    if (autoKick && warns.warns.length === autoKick) {
      message.client.commands.get('kick')
        .run(message, [member.id, `Limite d'avertissement atteinte. Lancé automatiquement par ${message.guild.members.me}.`]);
    }
  }
};