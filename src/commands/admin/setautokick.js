const Command = require('../Alcatraz.js');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { oneLine } = require('common-tags');

module.exports = class SetAutoKickCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setautokick',
      aliases: ['setak', 'sak'],
      usage: 'setautokick <nombre>',
      description: oneLine`
      Définit le nombre d'avertissements nécessaires avant que Alcatraz expulse automatiquement quelqu'un de votre serveur.
      Ne fournissez aucun nombre d'avertissements ou un nombre d'avertissements de 0 pour désactiver \`l'auto kick\`.
      `,
      type: client.types.ADMIN,
      userPermissions: [PermissionFlagsBits.ManageGuild],
      examples: ['setautokick 3']
    });
  }
  run(message, args) {

    const autoKick = message.client.db.settings.selectAutoKick.pluck().get(message.guild.id) || 'désactivé';
    const amount = args[0];
    if (amount && (!Number.isInteger(Number(amount)) || amount < 0)) 
      return this.sendErrorMessage(message, 'Argument invalide. Veuillez saisir un nombre positif.');
      
    const embed = new EmbedBuilder()
      .setTitle('Paramètres: `Auto Kick`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription('`L\'auto kick` a été mis à jour avec succès. ✅') 
      .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
      .setTimestamp()
      .setColor(0x2f3136);

    if (args.length === 0 || amount == 0) {
      message.client.db.settings.updateAutoKick.run(null, message.guild.id);
      return message.channel.send({ embeds: [embed.addFields({ name: 'Statut', value: `\`${autoKick}\` ➔ \`désactivé\`` })] });
    }

    message.client.db.settings.updateAutoKick.run(amount, message.guild.id);
    message.channel.send({ embeds: [embed.addFields({ name: 'Statut', value: `\`${autoKick}\` ➔ \`${amount}\`` })] });
  }
};