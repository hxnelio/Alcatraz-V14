const Command = require('../Alcatraz.js');
const ButtonsMenu = require('../ButtonsMenu.js');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = class ModsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'moderateur',
      usage: 'moderateur',
      description: 'Affiche une liste de tous les modérateurs actuels.',
      type: client.types.INFO,
      clientPermissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AddReactions]
    });
  }
  run(message) {
    
    const modRoleId = message.client.db.settings.selectModRoleId.pluck().get(message.guild.id);
    const modRole = message.guild.roles.cache.get(modRoleId) || '`Aucun`';

    const mods = message.guild.members.cache.filter(m => {
      if (m.roles.cache.find(r => r === modRole)) return true;
    }).sort((a, b) => (a.joinedAt > b.joinedAt) ? 1 : -1).toArray();

    const embed = new EmbedBuilder()
      .setTitle(`Listes des moderateurs [${mods.length}]`)
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addFields(
        { name: 'Rôle des modérateurs', value: modRole.toString() },
        { name: 'Nombre de modérateurs', value: `**${mods.length}** membre(s) sur **${message.guild.members.cache.size}** membres` }
      )
      .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
      .setTimestamp()
      .setColor(0x2f3136);

    let max = 25;
    if (mods.length === 0) message.channel.send({ embeds: [embed.setDescription('Aucun modérateur trouvé.')] });
    else if (mods.length <= max) {
      const range = (mods.length == 1) ? '[1]' : `[1 - ${mods.length}]`;
      message.channel.send({ embeds: [embed
        .setTitle(`Liste des modérateurs ${range}`)
        .setDescription(mods.join('\n'))
      ]});

    } else {

      let n = 0, interval = max;
      embed
        .setTitle(`Liste des modérateurs [1 - ${max}]`)
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .setFooter({
          text: 'Expire après deux minutes.\n' + message.member.displayName,
          iconURL: message.author.displayAvatarURL({ dynamic: true })
        })
        .setDescription(mods.slice(n, max).join('\n'));

      const json = embed.toJSON();

      const previous = () => {
        if (n === 0) return;
        n -= interval;
        max -= interval;
        if (max <= n + interval) max = n + interval;
        return new EmbedBuilder(json)
          .setTitle(`Liste des modérateurs [${n + 1} - ${max}]`)
          .setDescription(mods.slice(n, max).join('\n'));
      };

      const next = () => {
        if (max === mods.length) return;
        n += interval;
        max += interval;
        if (max >= mods.length) max = mods.length;
        return new EmbedBuilder(json)
          .setTitle(`Liste des modérateurs [${n + 1} - ${max}]`)
          .setDescription(mods.slice(n, max).join('\n'));
      };

      const buttons = {
        'previous': previous,
        'next': next,
      };

      new ButtonsMenu(message.client, message.channel, message.member, embed, mods, 25, buttons);
    }
  }
};