const Command = require('../Alcatraz.js');
const ButtonsMenu = require('../ButtonsMenu.js');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const art = [
  'https://i.imgur.com/EtQeZ5c.png',
  'https://i.imgur.com/WP9d2Z2.png'
];

module.exports = class GalleryCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'gallery',
      aliases: ['art'],
      usage: 'gallery',
      description: 'Affiche une galerie d\'art d\'Alcatraz.',
      type: client.types.INFO,
      clientPermissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AddReactions]
    });
  }
  run(message) {
    let n = 0;
    const embed = new EmbedBuilder()
      .setTitle('Galerie d\'Alcatraz')
      .setDescription('Tous les images d\'Alcatraz.')
      .setImage(art[n])
      .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
      .setTimestamp()
      .setColor(0x2f3136);
    const json = embed.toJSON();
    const previous = () => {
      (n <= 0) ? n = art.length - 1 : n--;
      return new EmbedBuilder(json).setImage(art[n]);
    };
    const next = () => {
      (n >= art.length - 1) ? n = 0 : n++;
      return new EmbedBuilder(json).setImage(art[n]);
    };

    const buttons = {
      'previous': previous,
      'next': next,
      'stop': () => null,
    };

    new ButtonsMenu(
      message.client,
      message.channel,
      message.member,
      embed,
      null,
      null,
      buttons,
      180000
    );
    
  }
};