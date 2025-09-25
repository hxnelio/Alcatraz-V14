const Command = require('../Alcatraz.js');
const { EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fetch = require('node-fetch');
const emojis = require('../../utils/emojis.json');
const config = require('../../../config.json');
const backup = require("discord-backup");
  backup.setStorageFolder(__dirname+"/backups/");

module.exports = class ChargerBackupCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'chargerbackup',
      usage: 'chargerbackup <ID>',
      aliases: ['chargerbck'],
      description: 'Charger une sauvegarde de votre serveur',
      type: client.types.BACKUP,
      clientPermissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AddReactions],
      userPermissions: [PermissionFlagsBits.Administrator]
    });
  }
  async run(message, args) {
    
        if(!message.member.permissions.has(PermissionFlagsBits.Administrator)){
            return message.channel.send(""+emojis.fail+" | Vous devez être administrateur de ce serveur pour charger une sauvegarde!");
        }
        let backupID = args[0];
        if(!backupID){
            return message.channel.send(""+emojis.fail+" | Vous devez spécifier un ID de sauvegarde valide!");
        }
        backup.fetch(backupID).then(async () => {
            const confirmButton = new ButtonBuilder()
                .setCustomId('confirm_backup')
                .setLabel('✅ Confirmer')
                .setStyle(ButtonStyle.Success);

            const cancelButton = new ButtonBuilder()
                .setCustomId('cancel_backup')
                .setLabel('❌ Annuler')
                .setStyle(ButtonStyle.Danger);

            const row = new ActionRowBuilder()
                .addComponents(confirmButton, cancelButton);

            const warningEmbed = new EmbedBuilder()
                .setTitle('⚠️ Confirmation requise')
                .setDescription('Lorsque la sauvegarde est chargée, tous les salons, rôles, etc. seront remplacés!')
                .setColor(0xFFA500)
                .setTimestamp();

            message.channel.send({embeds: [warningEmbed], components: [row]}).then(m => {
                const filter = i => i.user.id === message.author.id;
                const collector = m.createMessageComponentCollector({ filter, time: 20000 });

                collector.on('collect', async i => {
                    if (i.customId === 'confirm_backup') {
                        await i.deferUpdate();
                        
                        message.author.send(""+emojis.success+" | Votre sauvegarde c'est charger correctement!");
                        backup.load(backupID, message.guild).then(() => {
                            backup.remove(backupID);
                        }).catch((err) => {
                            return message.author.send(""+emojis.fail+" | Désolé, une erreur s'est produite ... Veuillez vérifier que je dispose des droits d'administrateur!");
                        });
                        
                        const successEmbed = new EmbedBuilder()
                            .setTitle('✅ Sauvegarde chargée')
                            .setDescription('La sauvegarde a été chargée avec succès!')
                            .setColor(0x2f3136);
                        
                        m.edit({embeds: [successEmbed], components: []});
                    } else if (i.customId === 'cancel_backup') {
                        await i.deferUpdate();
                        
                        const cancelEmbed = new EmbedBuilder()
                            .setTitle('❌ Opération annulée')
                            .setDescription('Chargement de sauvegarde annulé!')
                            .setColor(0x2f3136);
                        
                        m.edit({embeds: [cancelEmbed], components: []});
                    }
                });

                collector.on('end', () => {
                    const timeoutEmbed = new EmbedBuilder()
                        .setTitle('⏰ Temps écoulé')
                        .setDescription('Le temps est écoulé! Chargement de sauvegarde annulé!')
                        .setColor(0xFF0000);
                    
                    const disabledRow = new ActionRowBuilder()
                        .addComponents(
                            confirmButton.setDisabled(true),
                            cancelButton.setDisabled(true)
                        );
                    
                    m.edit({embeds: [timeoutEmbed], components: [disabledRow]});
                });
            });
    });
}};