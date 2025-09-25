const Command = require('../Alcatraz.js');
const { EmbedBuilder } = require('discord.js');

module.exports = class FindIdCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'findid',
      aliases: ['find', 'id'],
      usage: 'findid <@membre/@rôle/#salon>',
      description: 'Recherche l\'ID de l\'utilisateur, du rôle ou du salon de texte mentionné.',
      type: client.types.INFO,
      examples: ['findid @Alcatraz ', 'findid #salon']
    });
  }
  run(message, args) {
    const target = this.getMemberFromMention(message, args[0]) || 
      this.getRoleFromMention(message, args[0]) || 
      this.getChannelFromMention(message, args[0]);
    if (!target) 
      return this.sendErrorMessage(message, 0, 'Veuillez mentionner un utilisateur, un rôle ou un salon de texte');
    const id = target.id;
    const embed = new EmbedBuilder()
      .setTitle('Trouver l\'ID')
      .addFields(
        { name: 'Recherche', value: target.toString(), inline: true },
        { name: 'ID', value: `\`${id}\``, inline: true }
      )
      .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
      .setTimestamp()
      .setColor(0x2f3136);
    message.channel.send({ embeds: [embed] });
  }
};