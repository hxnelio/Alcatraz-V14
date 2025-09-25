const Command = require('../Alcatraz.js');
const ButtonsMenu = require('../ButtonsMenu.js');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { oneLine } = require('common-tags');

module.exports = class LeaderboardCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'leaderboard',
      aliases: ['top', 'rank'],
      usage: 'leaderboard [nombre]',
      description: oneLine`
        Affiche le classement des points serveur du nombre de membres fourni.
        Si aucun nombre de membres n'est indiqué, le classement sera par défaut de 10.
        La taille maximale du classement est de 25.      `,
      type: client.types.POINTS,
      clientPermissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AddReactions],
      examples: ['leaderboard 20']
    });
  }
  async run(message, args) {
    let max = parseInt(args[0]);
    if (!max || max < 0) max = 10;
    else if (max > 25) max = 25;
    let leaderboard = message.client.db.users.selectLeaderboard.all(message.guild.id);
    const position = leaderboard.map(row => row.user_id).indexOf(message.author.id);

    const members = [];
    let count = 1;
    for (const row of leaderboard) {
      members.push(oneLine`
        **${count}.** ${await message.guild.members.cache.get(row.user_id)} - \`${row.points}\` points
      `);
      count++;
    }

    const embed = new EmbedBuilder()
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setFooter({
        text: `Position de ${message.member.displayName} : ${position + 1}`,  
        iconURL: message.author.displayAvatarURL({ dynamic: true })
      })
      .setTimestamp()
      .setColor(0x2f3136);
    

    if (members.length <= max) {
      const range = (members.length == 1) ? '[1]' : `[1 - ${members.length}]`;
      message.channel.send({ embeds: [embed
        .setTitle(`Classement des points ${range}`)
        .setDescription(members.join('\n'))
      ] });

    } else {

      embed
        .setTitle('Classement des points')
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .setFooter({
          text: 'Expire après deux minutes.\n' + `Position de ${message.member.displayName}: ${position + 1}`,  
          iconURL: message.author.displayAvatarURL({ dynamic: true })
        });
      
      new ButtonsMenu(message.client, message.channel, message.member, embed, members, max);

    } 
  }
};