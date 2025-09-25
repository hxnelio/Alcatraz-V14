const Command = require('../Alcatraz.js');
const { EmbedBuilder } = require('discord.js');

module.exports = class CrownCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'couronne',
      usage: 'couronne',
      description: 'Affiche tous les membres couronnés du serveur, le rôle de la couronne et le calendrier de la couronne.',
      type: client.types.POINTS
    });
  }
  run(message) {
    const { crown_role_id: crownRoleId, crown_schedule: crownSchedule } = 
      message.client.db.settings.selectCrown.get(message.guild.id);
    const crownRole = message.guild.roles.cache.get(crownRoleId) || '`Aucun`';
    const crowned = Array.from(message.guild.members.cache.filter(m => {
      if (m.roles.cache.find(r => r === crownRole)) return true;
    }).values());

    let description = message.client.utils.trimStringFromArray(crowned);
    if (crowned.length === 0) description = 'Personne n\'a la couronne!';

    const embed = new EmbedBuilder()
      .setTitle(':crown:  Membres couronnés  :crown:')
      .setDescription(description)
      .addFields(
        { name: 'Rôle de la Couronne', value: crownRole },
        { name: 'Calendrier de la Couronne', value: `\`${crownSchedule || 'Aucun calendrier fourni'}\`` }
      )
      .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
      .setTimestamp()
      .setColor(0x2f3136);
    message.channel.send({ embeds: [embed] });
  }
};