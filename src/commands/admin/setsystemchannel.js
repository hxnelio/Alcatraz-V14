const Command = require('../Alcatraz.js');
const { EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { oneLine } = require('common-tags');

module.exports = class SetSystemChannelCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setsystemchannel',
      aliases: ['setsc', 'ssc'],
      usage: 'setsystemchannel <#salon/ID>',
      description: oneLine`
        Définit le salon de texte système pour votre serveur. C'est là que les messages système de Alcatraz seront envoyés.
        Ne fournissez aucun salon pour effacer le courant \`Salon système\`. La suppression de ce paramètre **n'est pas recommandée** 
        car Alcatraz nécessite un \`Salon système\` pour vous signaler des erreurs importantes.
      `,
      type: client.types.ADMIN,
      userPermissions: [PermissionFlagsBits.ManageGuild],
      examples: ['setsystemchannel #système']
    });
  }
  run(message, args) {
    const systemChannelId = message.client.db.settings.selectSystemChannelId.pluck().get(message.guild.id);
    const oldSystemChannel = message.guild.channels.cache.get(systemChannelId) || '`Aucun`';
    const embed = new EmbedBuilder()
      .setTitle('Paramètres: `Salon système`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription('Le `Salon système` a été mis à jour avec succès. ✅')
      .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
      .setTimestamp()
      .setColor(0x2f3136);

    if (args.length === 0) {
      message.client.db.settings.updateSystemChannelId.run(null, message.guild.id);
      return message.channel.send({ embeds: [embed.addFields({ name: 'Salon', value: `${oldSystemChannel} ➔ \`Aucun\`` })] });
    }

    const systemChannel = this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (!systemChannel || systemChannel.type != ChannelType.GuildText || !systemChannel.viewable)
      return this.sendErrorMessage(message, `
      Argument invalide. Veuillez mentionner un salon texte accessible ou fournir un identifiant de salon valide.
      `);
    message.client.db.settings.updateSystemChannelId.run(systemChannel.id, message.guild.id);
    message.channel.send({ embeds: [embed.addFields({ name: 'Salon', value: `${oldSystemChannel} ➔ ${systemChannel}` })] });
  }
};