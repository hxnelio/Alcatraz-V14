const Command = require('../Alcatraz.js');
const ButtonsMenu = require('../ButtonsMenu.js');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = class WarnsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'warnlist',
      usage: 'warnlist <@membre/ID>',
      description: 'Affiche les avertissements actuels d\'un membre. Un maximum de 5 avertissements peut être affiché à la fois.',
      type: client.types.MOD,
      userPermissions: [PermissionFlagsBits.KickMembers],
      examples: ['warnlist @GalackQSM']
    });
  }
  run(message, args) {

    const member = this.getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);
    if (!member) 
      return this.sendErrorMessage(message, 0, 'Veuillez mentionner un utilisateur ou fournir un ID utilisateur valide');

    let warns = message.client.db.users.selectWarns.pluck().get(member.id, message.guild.id) || { warns: [] };
    if (typeof(warns) == 'string') warns = JSON.parse(warns);
    const count = warns.warns.length;

    const embed = new EmbedBuilder()
      .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
      .setFooter({ text: message.member.displayName, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
      .setTimestamp()
      .setColor(message.guild.members.me.displayHexColor);
    
    const buildEmbed = (current, embed) => {
      const max = (count > current + 5) ? current + 5 : count;
      let amount = 0;
      for (let i = current; i < max; i++) {
        embed 
          .addFields(
            { name: '\u200b', value: `**Avertissements \`#${i + 1}\`**` },
            { name: 'Raison', value: warns.warns[i].reason },
            { name: 'Par', value: message.guild.members.cache.get(warns.warns[i].mod)?.toString() || '`Impossible de trouver le modérateur`', inline: true },
            { name: 'Date da l\'avertissement', value: warns.warns[i].date, inline: true }
          );
        amount += 1;
      }

      return embed
        .setTitle('Liste d\'avertissement ' + this.client.utils.getRange(warns.warns, current, 5))
        .setDescription(`Liste de ${member} avec un total de \`${count}\` avertissement(s).`);
    };

    if (count == 0) message.channel.send({
      embeds: [embed
        .setTitle('Liste d\'avertissement [0]')
        .setDescription(`${member} n'a actuellement aucun avertissement.`)
      ]
    });
    else if (count < 5) message.channel.send({ embeds: [buildEmbed(0, embed)] });
    else {

      let n = 0;
      const json = embed.setFooter({
        text: 'Expire après trois minutes.\n' + message.member.displayName,
        iconURL: message.author.displayAvatarURL({ dynamic: true })
      }).toJSON();
      
      const first = () => {
        if (n === 0) return;
        n = 0;
        return buildEmbed(n, new EmbedBuilder(json));
      };

      const previous = () => {
        if (n === 0) return;
        n -= 5;
        if (n < 0) n = 0;
        return buildEmbed(n, new EmbedBuilder(json));
      };

      const next = () => {
        const cap = count - (count % 5);
        if (n === cap || n + 5 === count) return;
        n += 5;
        if (n >= count) n = cap;
        return buildEmbed(n, new EmbedBuilder(json));
      };

      const last = () => {
        const cap = count - (count % 5);
        if (n === cap || n + 5 === count) return;
        n = cap;
        if (n === count) n -= 5;
        return buildEmbed(n, new EmbedBuilder(json));
      };

      const buttons = {
        'first': first,
        'previous': previous,
        'next': next,
        'last': last,
        'stop': null,
      };

      new ButtonsMenu(
        message.client,
        message.channel, 
        message.member, 
        buildEmbed(n, new EmbedBuilder(json)), 
        null,
        null,
        buttons, 
        180000
      );

    }
  }
};