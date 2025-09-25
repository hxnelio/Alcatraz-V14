const { EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { oneLine } = require('common-tags');

module.exports = (client, message) => {
  if (message.channel.type === ChannelType.DM || !message.channel.viewable || message.author.bot) return;

  let disabledCommands = client.db.settings.selectDisabledCommands.pluck().get(message.guild.id) || [];
  if (typeof(disabledCommands) === 'string') disabledCommands = disabledCommands.split(' ');
  
  const { point_tracking: pointTracking, message_points: messagePoints, command_points: commandPoints } = 
    client.db.settings.selectPoints.get(message.guild.id);
  const prefix = client.db.settings.selectPrefix.pluck().get(message.guild.id);
  const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\s*`);

  if (prefixRegex.test(message.content)) {
    let modChannelIds = message.client.db.settings.selectModChannelIds.pluck().get(message.guild.id) || [];
    if (typeof(modChannelIds) === 'string') modChannelIds = modChannelIds.split(' ');

    const [, match] = message.content.match(prefixRegex);
    const args = message.content.slice(match.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    let command = client.commands.get(cmd) || client.aliases.get(cmd);
    if (command && !disabledCommands.includes(command.name)) {
      if (modChannelIds.includes(message.channel.id)) {
        if (
          command.type != client.types.MOD || (command.type == client.types.MOD && 
          message.channel.permissionsFor(message.author).missing(command.userPermissions) != 0)
        ) {
          if (pointTracking)
            client.db.users.updatePoints.run({ points: messagePoints }, message.author.id, message.guild.id);
          return;
        }
      }

      const permission = command.checkPermissions(message);
      if (permission) {

        if (pointTracking)
          client.db.users.updatePoints.run({ points: commandPoints }, message.author.id, message.guild.id);
        message.command = true; 
        return command.run(message, args); 
      }
    } else if ( 
      (message.content === `<@${client.user.id}>` || message.content === `<@!${client.user.id}>`) &&
      message.channel.permissionsFor(message.guild.members.me).has([PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks]) &&
      !modChannelIds.includes(message.channel.id)
    ) {
      const embed = new EmbedBuilder()
        .setTitle(`Bonjour, je suis ${client.user.username}. Besoin d\'aide ?`)
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
        .setDescription(`Tu peux voir tout ce que je suis capable de faire en utilisant la commande \`${prefix}help\`.`)
        .addFields(
          { name: 'Tu me veux dans ton serveur ?', value: 'Tu peux m\'ajouter sur ton serveur en cliquant sur [ici](https://discordapp.com/oauth2/authorize?client_id=774652242787041310&scope=bot&permissions=403008599)!' },
          { name: 'Support', value: 'Si tu as des questions, des suggestions ou tu as trouvé un bogue, n\'hésite pas à rejoindre [Alcatraz empire](https://discord.gg/HPtTfqDdMr)!' }
        )
        .setFooter({ text: '© 2025 - Alcatraz | Projet open-source' })
        .setColor(0x2f3136);
      message.channel.send({ embeds: [embed] });
    }
  }
  if (pointTracking) client.db.users.updatePoints.run({ points: messagePoints }, message.author.id, message.guild.id);
};