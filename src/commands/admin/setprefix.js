const Command = require('../Alcatraz.js');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = class SetPrefixCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setprefix',
      aliases: ['setp', 'sp'],
      usage: 'setprefix <prefix>',
      description: 'Définie la commande `prefix` pour votre serveur. Le max `prefix` la longueur est de 3 caractères.',
      type: client.types.ADMIN,
      userPermissions: [PermissionFlagsBits.ManageGuild],
      examples: ['setprefix !']
    });
  }
  run(message, args) {
    const oldPrefix = message.client.db.settings.selectPrefix.pluck().get(message.guild.id);
    const prefix = args[0];
    if (!prefix) return this.sendErrorMessage(message, 'Argument invalide. Veuillez spécifier un préfix.');
    else if (prefix.length > 3) 
      return this.sendErrorMessage(
        message, 'Argument invalide. Veuillez vous assurer que le préfix ne dépasse pas 3 caractères.'
      );
    message.client.db.settings.updatePrefix.run(prefix, message.guild.id);
    const embed = new EmbedBuilder()
      .setTitle('Paramètres: `Prefix`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription('Le `prefix` a été mis à jour avec succès. ✅')
      .addFields({ name: 'Prefix', value: `\`${oldPrefix}\` ➔ \`${prefix}\`` })
      .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
      .setTimestamp()
      .setColor(0x2f3136);
    message.channel.send({ embeds: [embed] });
  }
};