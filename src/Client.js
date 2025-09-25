const { Client: DiscordClient, Collection, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { readdir, readdirSync } = require('fs');
const { join, resolve } = require('path');
const AsciiTable = require('ascii-table');
const { fail } = require('./utils/emojis.json');

class Client extends DiscordClient {
 constructor(config, options = {}) {  
    super(options);
    this.logger = require('./utils/logger.js');
    this.db = require('./utils/db.js');
    this.types = {
      INFO: 'Informations',
      FUN: 'Fun',
      COLOR: 'Couleurs',
      POINTS: 'Points',
      ECONOMY: 'Economie',
      GENERAL: 'Général',
      AVATAR: 'Avatar',
      NFSW: 'NFSW',
      BACKUP: 'Backup',
      MOD: 'Modération',
      ADMIN: 'Administration',
      OWNER: 'Propriétaire'
    };
    this.commands = new Collection();
    this.aliases = new Collection();
    this.topics = [];
    this.token = config.token;
    this.apiKeys = config.apiKeys;
    this.ownerId = config.ownerId;
    this.bugReportChannelId = config.bugReportChannelId;
    this.feedbackChannelId = config.feedbackChannelId;
    this.serverLogId = config.serverLogId;
    this.utils = require('./utils/utils.js');
    this.logger.info('Initialisation...');

  }

  loadEvents(path) {
    readdir(path, (err, files) => {
      if (err) this.logger.error(err);
      files = files.filter(f => f.split('.').pop() === 'js');
      if (files.length === 0) return this.logger.warn('Aucun événement trouvé');
      this.logger.info(`${files.length} événement(s) trouvé(s)...`);
      files.forEach(f => {
        const eventName = f.substring(0, f.indexOf('.'));
        try {
          const event = require(resolve(__basedir, join(path, f)));
          if (typeof event !== 'function') {
            this.logger.error(`L'événement ${eventName} n'exporte pas une fonction valide`);
            return;
          }
          super.on(eventName, event.bind(null, this));
          delete require.cache[require.resolve(resolve(__basedir, join(path, f)))]; 
          this.logger.info(`Chargement de l'évenement: ${eventName}`);
        } catch (error) {
          this.logger.error(`Erreur lors du chargement de l'événement ${eventName}: ${error.message}`);
        }
      });
    });
    return this;
  }

  loadCommands(path) {
    this.logger.info('Chargement des commandes...');
    let table = new AsciiTable('Commandes');
    table.setHeading('Fichiers', 'Aliases', 'Catégories', 'Statut');
    readdirSync(path).filter( f => !f.endsWith('.js')).forEach( dir => {
      const commands = readdirSync(resolve(__basedir, join(path, dir))).filter(f => f.endsWith('js'));
      commands.forEach(f => {
        const Command = require(resolve(__basedir, join(path, dir, f)));
        const command = new Command(this); // Instantiate the specific command
        if (command.name && !command.disabled) {
          // Map command
          this.commands.set(command.name, command);
          // Map command aliases
          let aliases = '';
          if (command.aliases) {
            command.aliases.forEach(alias => {
              this.aliases.set(alias, command);
            });
            aliases = command.aliases.join(', ');
          }
          table.addRow(f, aliases, command.type, 'pass');
        } else {
          this.logger.warn(`${f} échec du chargement`);
          table.addRow(f, '', '', 'fail');
          return;
        }
      });
    });
    this.logger.info(`\n${table.toString()}`);
    return this;
  }

  isOwner(user) {
    if (user.id === this.ownerId) return true;
    else return false;
  }

  sendSystemErrorMessage(guild, error, errorMessage) {

    const systemChannelId = this.db.settings.selectSystemChannelId.pluck().get(guild.id);
    const systemChannel = guild.channels.cache.get(systemChannelId);

    if ( 
      !systemChannel || 
      !systemChannel.viewable || 
      !systemChannel.permissionsFor(guild.members.me).has([PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks])
    ) return;

    const embed = new EmbedBuilder()
      .setAuthor({ name: `${this.user.tag}`, iconURL: this.user.displayAvatarURL({ dynamic: true }) })
      .setTitle(`${fail} Erreur système: \`${error}\``)
      .setDescription(`\`\`\`diff\n- Défaillance du système\n+ ${errorMessage}\`\`\``)
      .setTimestamp()
      .setColor(guild.members.me.displayHexColor);
    systemChannel.send({ embeds: [embed] });
  }
}

module.exports = Client;