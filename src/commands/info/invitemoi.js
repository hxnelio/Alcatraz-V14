const Command = require('../Alcatraz.js');
const { EmbedBuilder } = require('discord.js');
const { oneLine } = require('common-tags');

module.exports = class InviteMoiCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'invitemoi',
      aliases: ['invite', 'invme', 'im'],
      usage: 'inviteme',
      description: 'Génère un lien que vous pouvez utiliser pour inviter Alcatraz sur votre propre serveur.',
      type: client.types.INFO
    });
  }
  run(message) {
    const embed = new EmbedBuilder()
      .setTitle('Je serais ravi d\'être sur ton serveur !')
      .setThumbnail(message.guild.iconURL())
      .setDescription(`[Ajouter Alcatraz](https://discordapp.com/oauth2/authorize?client_id=${message.client.user.id}&scope=bot&permissions=2146958847) pour m'inviter sur ton serveur !`)
      .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
      .setTimestamp()
      .setColor(0x2f3136);
    message.channel.send({ embeds: [embed] });
  }
};