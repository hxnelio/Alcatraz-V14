const Command = require('../Alcatraz.js');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { oneLine } = require('common-tags');

module.exports = class SoftBanCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'softban',
      usage: 'softban <@membre/ID> [raison]',
      description: oneLine`
        Softbans un membre de votre serveur (banni puis débloque immédiatement).
        Cela efface tous les messages de ce membre de votre serveur.`,
      type: client.types.MOD,
      clientPermissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.BanMembers],
      userPermissions: [PermissionFlagsBits.BanMembers],
      examples: ['softban @GalackQSM']
    });
  }
  async run(message, args) {

    const member = this.getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);
    if (!member)
      return this.sendErrorMessage(message, 0, 'Veuillez mentionner un utilisateur ou fournir un ID utilisateur valide');
    if (member === message.member) 
      return this.sendErrorMessage(message, 0, 'Vous ne pouvez pas vous bannir'); 
    if (member.roles.highest.position >= message.member.roles.highest.position)
      return this.sendErrorMessage(message, 0, 'Vous ne pouvez pas bannir une personne ayant un rôle égal ou supérieur');
    if (!member.bannable)
      return this.sendErrorMessage(message, 0, 'Le membre fourni ne peut pas être banni');

    let reason = args.slice(1).join(' ');
    if (!reason) reason = '`Aucune raison fourni`';
    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';
    
    await member.ban({ reason: reason });
    await message.guild.members.unban(member.user, reason);

    const embed = new EmbedBuilder()
      .setTitle('Un membre viens d\'être softban')
      .setDescription(`Le membre **${member}** a été softban avec succès.`)
      .addFields(
        { name: 'Par', value: message.member.toString(), inline: true },
        { name: 'Membre', value: member.toString(), inline: true },
        { name: 'Raison', value: reason }
      )
      .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
      .setTimestamp()
      .setColor(0x2f3136);
    message.channel.send({ embeds: [embed] });
    message.client.logger.info(`${message.guild.name}: ${message.author.tag} à été softban ${member.user.tag}`);
        
    this.sendModLogMessage(message, reason, { Member: member});
  }
};