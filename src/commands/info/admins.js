const Command = require('../Alcatraz.js');
const ButtonsMenu = require('../ButtonsMenu.js');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = class AdminsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'admins',
      usage: 'admins',
      description: 'Affiche une liste de tous les administrateurs actuels.',
      type: client.types.INFO,
      clientPermissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AddReactions]
    });
  }
  run(message) {
    
    const adminRoleId = message.client.db.settings.selectAdminRoleId.pluck().get(message.guild.id);
    const adminRole = message.guild.roles.cache.get(adminRoleId) || '`Aucun`';

    const admins = Array.from(message.guild.members.cache.filter(m => {
      if (m.roles.cache.find(r => r === adminRole)) return true;
    }).sort((a, b) => (a.joinedAt > b.joinedAt) ? 1 : -1).values());

    const embed = new EmbedBuilder()
      .setTitle(`Liste des administrateurs [${admins.length}]`)
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addFields(
        { name: 'Rôle d\'administrateur', value: adminRole.toString() },
        { name: 'Nombre d\'administrateurs', value: `**${admins.length}** hors de **${message.guild.members.cache.size}** membres` }
      )
      .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
      .setTimestamp()
      .setColor(0x2f3136);

    let max = 25;
    if (admins.length === 0) message.channel.send({ embeds: [embed.setDescription('Aucun administrateur trouvé.')] });
    else if (admins.length <= max) {
      const range = (admins.length == 1) ? '[1]' : `[1 - ${admins.length}]`;
      message.channel.send({ embeds: [embed
        .setTitle(`Liste des administrateurs ${range}`)
        .setDescription(admins.join('\n'))
      ] });

    } else {

      let n = 0, interval = max;
      embed
        .setTitle(`Liste des administrateurs [1 - ${max}]`)
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .setFooter({ 
          text: 'Expire après deux minutes.\n' + message.member.displayName,
          iconURL: message.author.displayAvatarURL({ dynamic: true })
        })
        .setDescription(admins.slice(n, max).join('\n'));

      const json = embed.toJSON();

      const previous = () => {
        if (n === 0) return;
        n -= interval;
        max -= interval;
        if (max <= n + interval) max = n + interval;
        return new EmbedBuilder(json)
          .setTitle(`Liste des administrateurs [${n + 1} - ${max}]`)
          .setDescription(admins.slice(n, max).join('\n'));
      };

      const next = () => {
        if (max === admins.length) return;
        n += interval;
        max += interval;
        if (max >= admins.length) max = admins.length;
        return new EmbedBuilder(json)
          .setTitle(`Liste des administrateurs [${n + 1} - ${max}]`)
          .setDescription(admins.slice(n, max).join('\n'));
      };

      const buttons = {
        'previous': previous,
        'next': next,
      };

      new ButtonsMenu(message.channel, message.member, embed, admins, 25, buttons);
    }
  }
};