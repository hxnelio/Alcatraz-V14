const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const permissions = require('../utils/permissions.json');
const { fail } = require('../utils/emojis.json');
class Command {
  constructor(client, options) {
    this.constructor.validateOptions(client, options);
    this.client = client;
    this.name = options.name;
    this.aliases = options.aliases || null;
    this.usage = options.usage || options.name;
    this.description = options.description || '';
    this.type = options.type || client.types.NFSW;
    this.clientPermissions = options.clientPermissions || [PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks];
    this.userPermissions = options.userPermissions || null;
    this.examples = options.examples || null;
    this.ownerOnly = options.ownerOnly || false;
    this.disabled = options.disabled || false;
    this.errorTypes = ['Commande incorrect', 'Échec de la commande'];
  }

  run(message, args) {
    throw new Error(`La commande ${this.name} n'a pas de méthode run ()`);
  }

  getMemberFromMention(message, mention) {
    if (!mention) return;
    const matches = mention.match(/^<@!?(\d+)>$/);
    if (!matches) return;
    const id = matches[1];
    return message.guild.members.cache.get(id);
  }

  getRoleFromMention(message, mention) {
    if (!mention) return;
    const matches = mention.match(/^<@&(\d+)>$/);
    if (!matches) return;
    const id = matches[1];
    return message.guild.roles.cache.get(id);
  }

  getChannelFromMention(message, mention) {
    if (!mention) return;
    const matches = mention.match(/^<#(\d+)>$/);
    if (!matches) return;
    const id = matches[1];
    return message.guild.channels.cache.get(id);
  }

  checkPermissions(message, ownerOverride = true) {
    if (!message.channel.permissionsFor(message.guild.members.me).has([PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks])) return false;
    const clientPermission = this.checkClientPermissions(message);
    const userPermission = this.checkUserPermissions(message, ownerOverride);
    if (clientPermission && userPermission) return true;
    else return false;
  }

  checkUserPermissions(message, ownerOverride = true) {
    if (!this.ownerOnly && !this.userPermissions) return true;
    if (ownerOverride && this.client.isOwner(message.author)) return true;
    if (this.ownerOnly && !this.client.isOwner(message.author)) {
      return false;
    }
    
    if (message.member.permissions.has(PermissionFlagsBits.Administrator)) return true;
    if (this.userPermissions) {
      const missingPermissions =
        message.channel.permissionsFor(message.author).missing(this.userPermissions).map(p => {
            
          const permissionName = Object.keys(permissions).find(key => 
            key === p || (typeof p === 'number' && PermissionFlagsBits[key] === p)
          );
          return permissionName ? permissions[permissionName] : p;
        });
      if (missingPermissions.length !== 0) {
        const embed = new EmbedBuilder()
          .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
          .setTitle(`${fail} Autorisations utilisateur manquantes: \`${this.name}\``)
          .setDescription(`\`\`\`diff\n${missingPermissions.map(p => `- ${p}`).join('\n')}\`\`\``)
          .setFooter({ text: "© 2024 - Alcatraz | Projet open-source" })
          .setTimestamp()
          .setColor(0x2f3136);
        message.channel.send({ embeds: [embed] });
        return false;
      }
    }
    return true;
  }

  checkClientPermissions(message) {
    const missingPermissions =
      message.channel.permissionsFor(message.guild.members.me).missing(this.clientPermissions).map(p => {
        // Essayer de trouver le nom de la permission dans le fichier permissions.json
        const permissionName = Object.keys(permissions).find(key => 
          key === p || (typeof p === 'number' && PermissionFlagsBits[key] === p)
        );
        return permissionName ? permissions[permissionName] : p;
      });
    if (missingPermissions.length !== 0) {
      const embed = new EmbedBuilder()
        .setAuthor({ name: `${this.client.user.tag}`, iconURL: message.client.user.displayAvatarURL({ dynamic: true }) })
        .setTitle(`${fail} Permissions de bot manquantes: \`${this.name}\``)
        .setDescription(`\`\`\`diff\n${missingPermissions.map(p => `- ${p}`).join('\n')}\`\`\``)
        .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
        .setTimestamp()
        .setColor(0x2f3136);
      message.channel.send({ embeds: [embed] });
      return false;

    } else return true;
  }
  
  sendErrorMessage(message, errorType, reason, errorMessage = null) {
    errorType = this.errorTypes[errorType];
    const prefix = message.client.db.settings.selectPrefix.pluck().get(message.guild.id);
    const embed = new EmbedBuilder()
      .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
      .setTitle(`${fail} Erreur de commande: \`${this.name}\``)
      .setDescription(`\`\`\`diff\n- ${errorType}\n+ ${reason}\`\`\``)
      .addFields({ name: 'Usage', value: `\`${prefix}${this.usage}\`` })
      .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
      .setTimestamp()
      .setColor(0x2f3136);
    if (this.examples) embed.addFields({ name: 'Exemples', value: this.examples.map(e => `\`${prefix}${e}\``).join('\n') });
    if (errorMessage) embed.addFields({ name: 'Message d\'erreur', value: `\`\`\`${errorMessage}\`\`\`` });
    message.channel.send({ embeds: [embed] });
  }
async sendModLogMessage(message, reason, fields = {}) {
    const modLogId = message.client.db.settings.selectModLogId.pluck().get(message.guild.id);
    const modLog = message.guild.channels.cache.get(modLogId);
    if (
      modLog && 
      modLog.viewable &&
      modLog.permissionsFor(message.guild.members.me).has([PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks])
    ) {
      const caseNumber = await message.client.utils.getCaseNumber(message.client, message.guild, modLog);
      const embed = new EmbedBuilder()
        .setTitle(`Action: \`${message.client.utils.capitalize(this.name)}\``)
        .addFields({ name: 'Par', value: message.member.toString(), inline: true })
        .setFooter({ text: `Case #${caseNumber}` })
        .setTimestamp()
        .setColor(message.guild.members.me.displayHexColor);
      for (const field in fields) {
        embed.addFields({ name: field, value: fields[field], inline: true });
      }
      embed.addFields({ name: 'Reason', value: reason });
      modLog.send({ embeds: [embed] }).catch(err => message.client.logger.error(err.stack));
    }
  }

  static validateOptions(client, options) {

    if (!client) throw new Error('Aucun client n\'a été trouvé');
    if (typeof options !== 'object') throw new TypeError('Les options de commande ne sont pas un objet');

    if (typeof options.name !== 'string') throw new TypeError('Le nom de la commande n\'est pas une chaîne');
    if (options.name !== options.name.toLowerCase()) throw new Error('Le nom de la commande n\'est pas en minuscules');

    if (options.aliases) {
      if (!Array.isArray(options.aliases) || options.aliases.some(ali => typeof ali !== 'string'))
        throw new TypeError('Les alias de commande ne sont pas un tableau de chaînes');

      if (options.aliases.some(ali => ali !== ali.toLowerCase()))
        throw new RangeError('Les alias de commande ne sont pas en minuscules');

      for (const alias of options.aliases) {
        if (client.aliases.get(alias)) throw new Error('L\'alias de commande existe déjà');
      }
    }

    if (options.usage && typeof options.usage !== 'string') throw new TypeError('L\'utilisation de la commande n\'est pas une chaîne');

    if (options.description && typeof options.description !== 'string') 
      throw new TypeError('La description de la commande n\'est pas une chaîne');
    
    if (options.type && typeof options.type !== 'string') throw new TypeError('Le type de commande n\'est pas une chaîne');
    if (options.type && !Object.values(client.types).includes(options.type))
      throw new Error('Le type de commande n\'est pas valide');
    
    if (options.clientPermissions) {
      if (!Array.isArray(options.clientPermissions))
        throw new TypeError('La commande clientPermissions n\'est pas un tableau de permissions');
    }

    if (options.userPermissions) {
      if (!Array.isArray(options.userPermissions))
        throw new TypeError('La commande userPermissions n\'est pas un tableau de permissions');
    }

    if (options.examples && !Array.isArray(options.examples))
      throw new TypeError('Les exemples de commande ne sont pas un tableau de chaînes de clé d\'autorisation');

    if (options.ownerOnly && typeof options.ownerOnly !== 'boolean') 
      throw new TypeError('La commande ownerOnly n\'est pas une valeur booléenne');

    if (options.disabled && typeof options.disabled !== 'boolean') 
      throw new TypeError('La commande désactivée n\'est pas un booléen');
  }
}

module.exports = Command;