const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
module.exports = class ButtonsMenu {
  constructor(client, channel, member, embed, arr = null, interval = 10, buttons = {
    'first': this.first.bind(this), 
    'previous': this.previous.bind(this), 
    'next': this.next.bind(this), 
    'last': this.last.bind(this), 
    'stop': this.stop.bind(this)
  }, timeout = 120000) {
    this.client = client;
    this.channel = channel;
    this.memberId = member.id;
    this.embed = embed;
    this.json = this.embed.toJSON();
    this.arr = arr;
    this.interval = interval;
    this.current = 0;
    this.max = (this.arr) ? arr.length : null;
    this.buttons = buttons;
    this.buttonIds = Object.keys(this.buttons);
    this.timeout = timeout;

    const first = new EmbedBuilder(this.json);
    const description = (this.arr) ? this.arr.slice(this.current, this.interval) : null;
    if (description) first
      .setTitle(this.embed.title + ' ' + this.client.utils.getRange(this.arr, this.current, this.interval))
      .setDescription(description);

    this.createButtons().then(actionRow => {
      this.channel.send({ embeds: [first], components: [actionRow] }).then(message => {
        this.message = message;
        this.createCollector();
      });
    });
  }

  async createButtons() {
    const actionRow = new ActionRowBuilder();
    
    const buttonConfigs = {
      'first': { label: 'Premier', emoji: '⏪', style: ButtonStyle.Primary },
      'previous': { label: 'Précédent', emoji: '◀️', style: ButtonStyle.Secondary },
      'next': { label: 'Suivant', emoji: '▶️', style: ButtonStyle.Secondary },
      'last': { label: 'Dernier', emoji: '⏩', style: ButtonStyle.Primary },
      'stop': { label: 'Arrêter', emoji: '⏹️', style: ButtonStyle.Danger }
    };
    
    for (const buttonId of this.buttonIds) {
      const config = buttonConfigs[buttonId];
      if (config) {
        actionRow.addComponents(
          new ButtonBuilder()
            .setCustomId(buttonId)
            .setLabel(config.label)
            .setEmoji(config.emoji)
            .setStyle(config.style)
        );
      }
    }
    
    return actionRow;
  }

  createCollector() {
    const collector = this.message.createMessageComponentCollector({
      componentType: ComponentType.Button,
      filter: (interaction) => {
        return this.buttonIds.includes(interaction.customId) && interaction.user.id === this.memberId;
      },
      time: this.timeout
    });
    
    collector.on('collect', async interaction => {
      let newPage = this.buttons[interaction.customId];
      if (typeof newPage === 'function') newPage = newPage();
      
      if (newPage) {
        const actionRow = await this.createButtons();
        await interaction.update({ embeds: [newPage], components: [actionRow] });
      } else {
        await interaction.deferUpdate();
      }
    }); 

    collector.on('end', async () => {
      try {
        const disabledRow = new ActionRowBuilder();
        for (const buttonId of this.buttonIds) {
          const buttonConfigs = {
            'first': { label: 'Premier', emoji: '⏪', style: ButtonStyle.Primary },
            'previous': { label: 'Précédent', emoji: '◀️', style: ButtonStyle.Secondary },
            'next': { label: 'Suivant', emoji: '▶️', style: ButtonStyle.Secondary },
            'last': { label: 'Dernier', emoji: '⏩', style: ButtonStyle.Primary },
            'stop': { label: 'Arrêter', emoji: '⏹️', style: ButtonStyle.Danger }
          };
          const config = buttonConfigs[buttonId];
          if (config) {
            disabledRow.addComponents(
              new ButtonBuilder()
                .setCustomId(buttonId)
                .setLabel(config.label)
                .setEmoji(config.emoji)
                .setStyle(config.style)
                .setDisabled(true)
            );
          }
        }
        await this.message.edit({ components: [disabledRow] });
      } catch (error) {
        
      }
    });

    this.collector = collector;
  }
  first() {
    if (this.current === 0) return;
    this.current = 0;
    return new EmbedBuilder(this.json)
      .setTitle(this.embed.title + ' ' + this.client.utils.getRange(this.arr, this.current, this.interval))
      .setDescription(this.arr.slice(this.current, this.current + this.interval));
  }
  previous() {
    if (this.current === 0) return;
    this.current -= this.interval;
    if (this.current < 0) this.current = 0;
    return new EmbedBuilder(this.json)
      .setTitle(this.embed.title + ' ' + this.client.utils.getRange(this.arr, this.current, this.interval))
      .setDescription(this.arr.slice(this.current, this.current + this.interval));
  }
  next() {
    const cap = this.max - (this.max % this.interval);
    if (this.current === cap || this.current + this.interval === this.max) return;
    this.current += this.interval;
    if (this.current >= this.max) this.current = cap;
    const max = (this.current + this.interval >= this.max) ? this.max : this.current + this.interval;
    return new EmbedBuilder(this.json)
      .setTitle(this.embed.title + ' ' + this.client.utils.getRange(this.arr, this.current, this.interval))
      .setDescription(this.arr.slice(this.current, max));
  }
  last() {
    const cap = this.max - (this.max % this.interval);
    if (this.current === cap || this.current + this.interval === this.max) return;
    this.current = cap;
    if (this.current === this.max) this.current -= this.interval;
    return new EmbedBuilder(this.json)
      .setTitle(this.embed.title + ' ' + this.client.utils.getRange(this.arr, this.current, this.interval))
      .setDescription(this.arr.slice(this.current, this.max));
  }
  stop() {
    this.collector.stop();
  }
};