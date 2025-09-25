const Command = require('../Alcatraz.js');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const colors = require('../../utils/colors.json');
const len = Object.keys(colors).length;
const { oneLine } = require('common-tags');

module.exports = class CreateDefaultColorsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'creedefaultcolors',
      aliases: ['cdc'],
      usage: 'creedefaultcolors',
      description: oneLine`
        Génère les rôles de couleur par défaut fournis avec Alcatraz sur votre serveur.
        Les rôles de couleur sont indiqués par le préfixe \`#\`.
      `,
      type: client.types.COLOR,
      clientPermissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.ManageRoles],
      userPermissions: [PermissionFlagsBits.ManageRoles]
    });
  }
  async run(message) {

    const embed = new EmbedBuilder()
      .setTitle('Créer les couleurs par défaut')
      .setDescription('Création des couleurs...')
      .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
      .setTimestamp()
      .setColor(0x2f3136);
    const msg = await message.channel.send({ embeds: [embed] });

    let position = 1;
    const colorList = [];
    for (let [key, value] of Object.entries(colors)){
      key = '#' + key;
      if (!message.guild.roles.cache.find(r => r.name === key)) {
        try {
          const role = await message.guild.roles.create({
            name: key,
            color: value,
            position: position,
            permissions: []
          });
          colorList.push(role);
          position++; 
        } catch (err) {
          message.client.logger.error(err.message);
        }
      } 
    }
    const fails = len - colorList.length;
    embed 
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`Création de \`${len - fails}\` sur  \`${len}\` des couleurs par défaut.`)
      .addFields({ name: 'Couleurs créées', value: (colorList.length > 0) ? colorList.reverse().join(' ') : '`Aucune`' })
      .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
      .setTimestamp()
      .setColor(0x2f3136);
    msg.edit({ embeds: [embed] });
  }
};