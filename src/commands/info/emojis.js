const Command = require('../Alcatraz.js');
const ButtonsMenu = require('../ButtonsMenu.js');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = class EmojisCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'emojis',
      aliases: ['e'],
      usage: 'emojis',
      description: 'Affiche une liste de tous les emojis actuels.',
      type: client.types.INFO
    });
  }
  run(message) {

    const emojis = [];
    message.guild.emojis.cache.forEach(e => emojis.push(`${e} **-** \`:${e.name}:\``));

    const embed = new EmbedBuilder()
      .setTitle(`Listes de emojis [${message.guild.emojis.cache.size}]`)
      .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
      .setTimestamp()
      .setColor(0x2f3136);

    let max = 25;
    if (emojis.length === 0) message.channel.send({ embeds: [embed.setDescription('Désolé! Aucun émojis trouvé 😢')] });
    else if (emojis.length <= max) {
      const range = (emojis.length == 1) ? '[1]' : `[1 - ${emojis.length}]`;
      message.channel.send({ embeds: [embed
        .setTitle(`Listes des emojis ${range}`)
        .setDescription(emojis.join('\n'))
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
      ]});
    
    } else {

      let n = 0;
      embed
        .setTitle(`Listes des emojis [1 - ${max}]`)
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .setFooter({
          text: 'Expire après deux minutes.\n' + message.member.displayName,
          iconURL: message.author.displayAvatarURL({ dynamic: true })
        })
        .setDescription(emojis.slice(n, max).join('\n'));

      const json = embed.toJSON();

      const previous = () => {
        if (n === 0) return;
        n -= 25;
        max -= 25;
        if (max < 25) max = 25;
        return new EmbedBuilder(json)
          .setTitle(`Liste des emojis [${n + 1} - ${max}]`)
          .setDescription(emojis.slice(n, max).join('\n'));
      };

      const next = () => {
        if (max === emojis.length) return;
        n += 25;
        max += 25;
        if (max >= emojis.length) max = emojis.length;
        return new EmbedBuilder(json)
          .setTitle(`Listes de emojis [${n + 1} - ${max}]`)
          .setDescription(emojis.slice(n, max).join('\n'));
      };

      const buttons = {
        'previous': previous,
        'next': next,
      };

      new ButtonsMenu(message.client, message.channel, message.member, embed, emojis, 25, buttons);
    }
  }
};