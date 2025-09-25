const Command = require('../Alcatraz.js');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { oneLine } = require('common-tags');

module.exports = class ToggleCommandCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'desacommande',
      usage: 'desacommande <commande>',
      description: oneLine`
        Active ou désactive la commande fournie.
        Les commandes désactivées ne pourront plus être utilisées et n'apparaîtront plus dans la commande \`help\`.
        \`${client.types.ADMIN}\` les commandes ne peuvent pas être désactivées.
      `,
      type: client.types.ADMIN,
      userPermissions: [PermissionFlagsBits.ManageGuild],
      examples: ['desacommande ping']
    });
  }
  run(message, args) {

    const command = message.client.commands.get(args[0]) || message.client.aliases.get(args[0]);
    if (!command || (command && command.type == message.client.types.OWNER)) 
      return this.sendErrorMessage(message, 'Argument invalide. Veuillez fournir une commande valide.');

    if (command.type === message.client.types.ADMIN) 
      return this.sendErrorMessage(message, `
      Argument invalide. \`${message.client.types.ADMIN}\` les commandes ne peuvent pas être désactivées.
      `);

    let disabledCommands = message.client.db.settings.selectDisabledCommands.pluck().get(message.guild.id) || [];
    if (typeof(disabledCommands) === 'string') disabledCommands = disabledCommands.split(' ');

    let description;

    // Disable command
    if (!disabledCommands.includes(command.name)) {
      disabledCommands.push(command.name); 
      description = `La commande \`${command.name}\` est maintenant **non actif**. ❌`;
    
    // Enable command
    } else {
      message.client.utils.removeElement(disabledCommands, command.name);
      description = `La commande \`${command.name}\` est maintenant **actif**. ✅`;
    }

    message.client.db.settings.updateDisabledCommands.run(disabledCommands.join(' '), message.guild.id);

    disabledCommands = disabledCommands.map(c => `\`${c}\``).join(' ') || '`Aucune`';
    const embed = new EmbedBuilder()
      .setTitle('Paramètres: `Commandes désactivées`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(description)
      .addFields(
        { name: 'Commandes désactivées', value: disabledCommands, inline: true }
      )
      .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
      .setTimestamp()
      .setColor(0x2f3136);
    message.channel.send({ embeds: [embed] });
  }
};