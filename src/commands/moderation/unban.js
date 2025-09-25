const Command = require('../Alcatraz.js');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

const rgx = /^(?:<@!?)?(\d+)>?$/;

module.exports = class UnbanCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'unban',
      usage: 'unban <ID> [raison]',
      description: 'Débannir un membre du serveur.',
      type: client.types.MOD,
      clientPermissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.BanMembers],
      userPermissions: [PermissionFlagsBits.BanMembers],
      examples: ['unban 1234567890123456789'] 
    });
  }
  async run(message, args) {
    const id = args[0];
    if (!rgx.test(id)) return this.sendErrorMessage(message, 0, 'Veuillez fournir un identifiant d\'utilisateur valide');
    const bannedUsers = await message.guild.fetchBans();
    const user = bannedUsers.get(id).user;
    if (!user) return this.sendErrorMessage(message, 0, 'Impossible de trouver l\'utilisateur, veuillez vérifier l\'ID fourni');

    let reason = args.slice(1).join(' ');
    if (!reason) reason = '`Aucune raison fourni`';
    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';

    await message.guild.members.unban(user, reason);
    const embed = new EmbedBuilder()
      .setTitle('Un membre viens d\'être déban du serveur')
      .setDescription(`Le membre ${user.tag} a été débanni avec succès.`)
      .addFields(
        { name: 'Par', value: message.member.toString(), inline: true },
        { name: 'Membre', value: user.tag, inline: true },
        { name: 'Raison', value: reason }
      )
      .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
      .setTimestamp()
      .setColor(0x2f3136);

    message.channel.send({ embeds: [embed] });
    message.client.logger.info(`${message.guild.name}: ${message.author.tag} à debanni ${user.tag}`);
    
    this.sendModLogMessage(message, reason, { Member: user.tag });
  }
};