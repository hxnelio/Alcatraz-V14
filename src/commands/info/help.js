const Command = require('../Alcatraz.js');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const emojis = require('../../utils/emojis.json');
const { oneLine, stripIndent } = require('common-tags');

module.exports = class HelpCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'help',
      aliases: ['commands', 'h'],
      usage: 'help [commandes | all]',
      description: oneLine`
        Affiche une liste de toutes les commandes actuelles, triées par catégorie.
        Peut être utilisé en conjonction avec une commande pour plus d'informations.
        N'affichera que les commandes auxquelles vous êtes autorisé à accéder à moins que le paramètre \`all\` est donné.
      `,
      type: client.types.INFO,
      examples: ['help ping']
    });
  }
  run(message, args) {

    let disabledCommands = message.client.db.settings.selectDisabledCommands.pluck().get(message.guild.id) || [];
    if (typeof(disabledCommands) === 'string') disabledCommands = disabledCommands.split(' ');

    const all = (args[0] === 'all') ? args[0] : '';
    const embed = new EmbedBuilder();
    const prefix = message.client.db.settings.selectPrefix.pluck().get(message.guild.id); // Get prefix
    const { INFO, FUN, COLOR, POINTS, ECONOMY, NFSW, GENERAL, MOD, ADMIN, OWNER, BACKUP, AVATAR } = message.client.types;
    const { capitalize } = message.client.utils;
    
    const command = message.client.commands.get(args[0]) || message.client.aliases.get(args[0]);
    if (
      command && 
      (command.type != OWNER || message.client.isOwner(message.member)) && 
      !disabledCommands.includes(command.name)
    ) {
      
      embed 
        .setTitle(`Information de la commandes: \`${command.name}\``)
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .setDescription(command.description)
        .addFields(
          { name: 'Usage', value: `\`${prefix}${command.usage}\``, inline: true },
          { name: 'Catégorie', value: `\`${capitalize(command.type)}\``, inline: true }
        )
        .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
        .setTimestamp()
        .setColor(0x2f3136);
      if (command.aliases) embed.addFields({ name: 'Aliases', value: command.aliases.map(c => `\`${c}\``).join(' ') });
      if (command.examples) embed.addFields({ name: 'Exemples', value: command.examples.map(c => `\`${prefix}${c}\``).join('\n') });

    } else if (args.length > 0 && !all) {
      return this.sendErrorMessage(message, 0, 'Impossible de trouver la commande, veuillez vérifier la commande fournie');

    } else {

      const commands = {};
      for (const type of Object.values(message.client.types)) {
        commands[type] = [];
      }

      const emojiMap = {
        [INFO]: `${emojis.info} ${capitalize(INFO)}`,
        [FUN]: `${emojis.fun} ${capitalize(FUN)}`,
        [COLOR]: `${emojis.couleur} ${capitalize(COLOR)}`,
        [POINTS]: `${emojis.points} ${capitalize(POINTS)}`,
        [NFSW]: `${emojis.nsfw} ${capitalize(NFSW)}`,
        [GENERAL]: `${emojis.general} ${capitalize(GENERAL)}`,
        [AVATAR]: `${emojis.avatar} ${capitalize(AVATAR)}`,
        [ECONOMY]: `${emojis.economy} ${capitalize(ECONOMY)}`,
        [BACKUP]: `${emojis.backup} ${capitalize(BACKUP)}`,
        [MOD]: `${emojis.moderation} ${capitalize(MOD)}`,
        [ADMIN]: `${emojis.admin} ${capitalize(ADMIN)}`,
        [OWNER]: `${emojis.owner} ${capitalize(OWNER)}`
      };

      message.client.commands.forEach(command => {
        if (!disabledCommands.includes(command.name)) {
          if (command.userPermissions && command.userPermissions.every(p => message.member.permissions.has(p)) && !all)
            commands[command.type].push(`\`${command.name}\`,`);
          else if (!command.userPermissions || all) {
            commands[command.type].push(`\`${command.name}\`,`);
          }
        }
      });

      const total = Object.values(commands).reduce((a, b) => a + b.length, 0) - commands[OWNER].length;
      const size = message.client.commands.size - commands[OWNER].length;

      embed 
        .setTitle('Panel des commandes de Alcatraz')
        .setDescription(stripIndent`
          **Prefix:** \`${prefix}\`
          **Plus d'information:** \`${prefix}help [commande]\`
          **Nombre de commandes:** \`${message.client.commands.size}\`
          ${(!all && size != total) ? `**Toutes les commandes:** \`${prefix}help all\`` : ''}
        `)
        .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
        .setTimestamp()
        .setColor(0x2f3136);

      for (const type of Object.values(message.client.types)) {
        if (type === OWNER && !message.client.isOwner(message.member)) continue;
        if (commands[type][0])
          embed.addFields({ name: `**${emojiMap[type]} [${commands[type].length}]**`, value: commands[type].join(' ') });
      }

      embed.addFields({ 
        name: '**📎 Liens**', 
        value: '**[Ajouter Alcatraz](https://discordapp.com/oauth2/authorize?client_id=774652242787041310&scope=bot&permissions=2146958847) | ' +
        '[Alcatraz Empire](https://discord.gg/HPtTfqDdMr) | ' +
        '[Github](https://github.com/GalackQSM/Alcatraz)**'
      });
        
    }
    message.channel.send({ embeds: [embed] });
  }
};