const Command = require('../Alcatraz.js');
const ButtonsMenu = require('../ButtonsMenu.js');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = class ColorsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'couleurs',
      aliases: ['colorlist', 'cols', 'cs'],
      usage: 'colors',
      description: 'Affiche une liste de toutes les couleurs disponibles.',
      type: client.types.COLOR,
      clientPermissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AddReactions]
    });
  }
  run(message) {
   
    const colors = Array.from(message.guild.roles.cache.filter(c => c.name.startsWith('#'))
      .sort((a, b) => b.position - a.position).values());
    
    const embed = new EmbedBuilder()
      .setTitle(`Couleurs disponibles [${colors.length}]`)
      .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
      .setTimestamp()
      .setColor(0x2f3136);

    const prefix = message.client.db.settings.selectPrefix.pluck().get(message.guild.id); // Get prefix

    let max = 50;
    if (colors.length === 0) message.channel.send({ embeds: [embed.setDescription('Aucune couleur trouvée.')] });
    else if (colors.length <= max) {
      const range = (colors.length == 1) ? '[1]' : `[1 - ${colors.length}]`;
      message.channel.send({ embeds: [embed
        .setTitle(`Couleurs disponibles ${range}`)
        .setDescription(`${colors.join(' ')}\n\nFaite \`${prefix}couleur <nom de couleur>\` pour choisir une couleur de rôle.`)
      ] });
      
    } else {

      let n = 0, interval = max;
      embed
        .setTitle(`Couleurs disponibles [1 - ${max}]`)
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .setFooter({
          text: 'Expire après deux minutes.\n' + message.member.displayName,  
          iconURL: message.author.displayAvatarURL({ dynamic: true })
        })
        .setDescription(`${colors.slice(n, max).join(' ')}\n\nType \`${prefix}couleur <nom de couleur>\` en choisir un.`);

      new ButtonsMenu(message.client, message.channel, message.member, embed, colors, max);
      
    }
  }
};