const Command = require('../Alcatraz.js');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const emojis = require('../../utils/emojis.json');
const fetch = require("node-fetch");
const { oneLine, stripIndent } = require('common-tags');

module.exports = class HelpCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'pgif',
      usage: 'pgif',
      description: oneLine`
        Affiche une image NSFW.
      `,
      type: client.types.NSFW,
    });
  }
  run(message, args) {
        const embed = new EmbedBuilder().setColor(0x00FFFF);
        if (!message.channel.nsfw) {
            embed.setTitle(''+emojis.nsfw+' NSFW')
            .setDescription("Impossible d'afficher le contenu NSFW dans un salon SFW.")
            .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
            .setTimestamp()
            .setColor(0x2f3136);

            return message.channel.send({embeds: [embed]});
        }
        fetch(`https://nekobot.xyz/api/image?type=pgif`)
            .then(res => res.json())
            .then(data => {
                embed.setImage(data.message)
                embed.setTitle(''+emojis.nsfw+' '+message.author.username+' voici votre image Pgif')
                embed.setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
                embed.setTimestamp()
                embed.setColor(0x2f3136);

                const deleteButton = new ButtonBuilder()
                    .setCustomId('delete_nsfw')
                    .setLabel('🗑️ Supprimer')
                    .setStyle(ButtonStyle.Danger);

                const row = new ActionRowBuilder()
                    .addComponents(deleteButton);

                message.channel.send({embeds: [embed], components: [row]}).then(msg => {
                    const filter = i => i.user.id === message.author.id && i.customId === 'delete_nsfw';
                    const collector = msg.createMessageComponentCollector({ filter, time: 60000 });

                    collector.on('collect', async i => {
                        if (i.customId === 'delete_nsfw') {
                            await i.deferUpdate();
                            await msg.delete().catch(() => {});
                        }
                    });

                    collector.on('end', () => {
                        const disabledRow = new ActionRowBuilder()
                            .addComponents(deleteButton.setDisabled(true));
                        msg.edit({ components: [disabledRow] }).catch(() => {});
                    });
                });
            })
            .catch(err => {
                this.client.logger.error(err.stack);
                return this.client.embed("APIError", message);
            });
    }
};