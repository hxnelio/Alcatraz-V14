const Command = require('../Alcatraz.js');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { oneLine, stripIndent } = require('common-tags');

module.exports = class SetNicknameCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setsurnom',
      aliases: ['setsrn', 'srn'],
      usage: 'setsurnom <@membre/ID> <pseudo> [raison]',
      description: oneLine`
        Remplace le pseudo de l'utilisateur fourni par celui spécifié.
        Entourez le nouveau surnom de guillemets s'il contient plus d'un mot.
        Le surnom ne peut pas comporter plus de 32 caractères.`,
      type: client.types.MOD,
      clientPermissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.ManageNicknames],
      userPermissions: [PermissionFlagsBits.ManageNicknames],
      examples: ['setsurnom @Henelio surnom','setsurnom @Henelio "nouveau surnom"']
    });
  }
  async run(message, args) {

    const member = this.getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);
    if (!member)
      return this.sendErrorMessage(message, 0, 'Veuillez mentionner un utilisateur ou fournir un ID utilisateur valide');
    if (member.roles.highest.position >= message.member.roles.highest.position && member != message.member)
      return this.sendErrorMessage(message, 0, stripIndent`
        Vous ne pouvez pas changer le surnom d'une personne ayant un rôle égal ou supérieur
      `);

    if (!args[1]) return this.sendErrorMessage(message, 0, 'Veuillez fournir un surnom');

    let nickname = args[1];
    if (nickname.startsWith('"')) {
      nickname = message.content.slice(message.content.indexOf(args[1]) + 1);
      if (!nickname.includes('"')) 
        return this.sendErrorMessage(message, 0, 'Veuillez vous assurer que le surnom est entouré de guillemets');
      nickname = nickname.slice(0, nickname.indexOf('"'));
      if (!nickname.replace(/\s/g, '').length) return this.sendErrorMessage(message, 0, 'Veuillez fournir un surnom');
    }

    if (nickname.length > 32) {
      return this.sendErrorMessage(message, 0, 'Veuillez vous assurer que le surnom ne dépasse pas 32 caractères');
      
    } else {

      let reason;
      if (args[1].startsWith('"')) 
        reason = message.content.slice(message.content.indexOf(nickname) + nickname.length + 1);
      else reason = message.content.slice(message.content.indexOf(nickname) + nickname.length);
      if (!reason) reason = '`Aucune raison fourni`';
      if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';

      try {

        // Change nickname
        const oldNickname = member.nickname || '`Aucun`';
        const nicknameStatus = `${oldNickname} ➔ ${nickname}`;
        await member.setNickname(nickname);
        const embed = new EmbedBuilder()
          .setTitle('Nouveau surnom défini')
          .setDescription(`Le surnom de ${member} a été mis à jour avec succès.`)
          .addFields(
            { name: 'Par', value: message.member.toString(), inline: true },
            { name: 'Membre', value: member.toString(), inline: true },
            { name: 'Surnom', value: nicknameStatus, inline: true },
            { name: 'Raison', value: reason }
          )
          .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
          .setTimestamp()
          .setColor(0x2f3136)
        message.channel.send({ embeds: [embed] });

        this.sendModLogMessage(message, reason, { Member: member, Nickname: nicknameStatus });

      } catch (err) {
        message.client.logger.error(err.stack);
        this.sendErrorMessage(message, 1, 'Veuillez vérifier la hiérarchie des rôles', err.message);
      }
    }  
  }
};