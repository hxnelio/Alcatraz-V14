const Command = require('../Alcatraz.js');
const { EmbedBuilder } = require('discord.js');
const { stripIndent } = require('common-tags');

module.exports = class MembersCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'members',
      aliases: ['memberstatus'],
      usage: 'members',
      description: 'Affiche le nombre de membres du serveur en ligne, occupés, AFK et hors ligne.',
      type: client.types.INFO
    });
  }
  run(message) {
    const online = Array.from(message.guild.members.cache.values()).filter((m) => m.presence?.status === 'online').length;
    const offline = Array.from(message.guild.members.cache.values()).filter((m) => m.presence?.status === 'offline').length;
    const dnd = Array.from(message.guild.members.cache.values()).filter((m) => m.presence?.status === 'dnd').length;
    const afk = Array.from(message.guild.members.cache.values()).filter((m) => m.presence?.status === 'idle').length;
    const embed = new EmbedBuilder()
      .setTitle(`Statut des membres du serveur: [${message.guild.members.cache.size}] membres`)
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(stripIndent`
        :green_circle: **En Ligne**: \`${online}\` membres

        :red_circle: **Occupé**: \`${dnd}\` membres

        :yellow_circle: **AFK**: \`${afk}\` membres

        :white_circle: **Hors Ligne**: \`${offline}\` membres
      `)
      .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
      .setTimestamp()
      .setColor(0x2f3136);
    message.channel.send({ embeds: [embed] });
  }
};