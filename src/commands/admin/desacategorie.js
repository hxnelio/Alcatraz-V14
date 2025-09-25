const Command = require('../Alcatraz.js');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { oneLine } = require('common-tags');

module.exports = class ToggleTypeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'desacategorie',
      usage: 'desacategorie <catégorie de commande>',
      description: oneLine`
        Active ou désactive le type de commande fourni.
        Les commandes du type fourni seront désactivées à moins qu'elles ne soient toutes déjà désactivées,
        auquel cas ils seront activés.
        Les commandes désactivées ne pourront plus être utilisées et n'apparaîtront plus avec le \`help\` commande.
        \`${client.types.ADMIN}\` les commandes ne peuvent pas être désactivées.
      `,
      type: client.types.ADMIN,
      userPermissions: [PermissionFlagsBits.ManageGuild],
      examples: ['desacategorie Fun']
    });
  }
  run(message, args) {

    if (args.length === 0 || args[0].toLowerCase() === message.client.types.OWNER.toLowerCase())
      return this.sendErrorMessage(message, 'Argument invalide. Veuillez fournir une catégorie de commande valide.');
    
    const type = args[0].toLowerCase();
    
    if (type === message.client.types.ADMIN.toLowerCase()) 
      return this.sendErrorMessage(message, `
        Argument invalide. \`${message.client.types.ADMIN}\` les commandes ne peuvent pas être désactivées.
      `);

    let disabledCommands = message.client.db.settings.selectDisabledCommands.pluck().get(message.guild.id) || [];
    if (typeof(disabledCommands) === 'string') disabledCommands = disabledCommands.split(' ');

    let description;

    const typeListOrig = Object.values(message.client.types);
    const typeList = typeListOrig.map(t => t.toLowerCase());
    const commands = Array.from(message.client.commands.values()).filter(c => c.type.toLowerCase() === type);

    if (typeList.includes(type)) {

      if (disabledCommands.length === commands.length) {
        for (const cmd of commands) {
          if (disabledCommands.includes(cmd.name)) message.client.utils.removeElement(disabledCommands, cmd.name);
        }
        description = oneLine`
          Toutes les commandes de catégorie \`${typeListOrig[typeList.indexOf(type)]}\` sont maintenant 
          **actif**. ✅
        `;
      
      } else {
        for (const cmd of commands) {
          if (!disabledCommands.includes(cmd.name)) disabledCommands.push(cmd.name);
        }
        description = oneLine`
          Toutes les commandes de catégorie \`${typeListOrig[typeList.indexOf(type)]}\` sont maintenant 
          **non actif**. ❌
        `;
      }
    } else return this.sendErrorMessage(message, 'Argument invalide. Veuillez fournir une catégorie de commande valide.');
      
    message.client.db.settings.updateDisabledCommands.run(disabledCommands.join(' '), message.guild.id);

    disabledCommands = disabledCommands.map(c => `\`${c}\``).join(' ') || '`Aucune`';
    const embed = new EmbedBuilder()
      .setTitle('Paramètres: `Catégorie de commandes désactivées`')
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