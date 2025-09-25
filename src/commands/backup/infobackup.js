const Command = require('../Alcatraz.js');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const fetch = require('node-fetch');
const backup = require("discord-backup");
const emojis = require('../../utils/emojis.json');
const config = require('../../../config.json');

  backup.setStorageFolder(__dirname+"/backups/");
module.exports = class BackupInfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'infobackup',
      usage: 'infobackup <ID>',
      aliases: ['infobck'],
      description: 'Informations sur la sauvegarde de votre serveur',
      type: client.types.BACKUP,
      clientPermissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AddReactions],
      userPermissions: [PermissionFlagsBits.Administrator]
    });
  }
  async run(message, args) {

        let backupID = args[0];
        if(!backupID){
            return message.channel.send(""+emojis.fail+" | Vous devez spécifier un ID de sauvegarde valide!");
        }
        backup.fetch(backupID).then((backupInfos) => {
            const date = new Date(backupInfos.data.createdTimestamp);
            const yyyy = date.getFullYear().toString(), mm = (date.getMonth()+1).toString(), dd = date.getDate().toString();
            const formatedDate = `${(dd[1]?dd:"0"+dd[0])}/${(mm[1]?mm:"0"+mm[0])}/${yyyy}`;
            let embed = new EmbedBuilder()
                .setAuthor({ name: "Informations de la sauvegarde" })
                .setThumbnail(backupInfos.data.iconURL)
                .addFields(
                    { name: "ID de sauvegarde", value: backupInfos.id, inline: false },
                    { name: "ID du serveur", value: backupInfos.data.guildID, inline: false },
                    { name: "Taille", value: `${backupInfos.size} mb`, inline: false },
                    { name: "Créé le", value: formatedDate, inline: false },
                    { name: "Région", value: backupInfos.data.region, inline: false }
                )
                .setFooter({ text: config.footer })
                .setTimestamp()
                .setColor(0x2f3136);
            message.channel.send({embeds: [embed]});
        }).catch((err) => {
            return message.channel.send(":x: | Aucune sauvegarde trouvée pour `"+backupID+"`!");
        });
    }
  };