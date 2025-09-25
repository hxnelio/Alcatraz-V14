const Command = require('../Alcatraz.js');
const { EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');

class ServersList extends Command {

  constructor (client) {
    super(client, {
      name: 'servers',
      aliases: ['servers-list'],
      usage: 'servers',
      description: 'Affiche la liste liste de serveur ou est Alcatraz.',
      type: client.types.OWNER,
      clientPermissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AddReactions]
    });
  }

  async run (message, args, data) {
        
    await message.delete();

    let i0 = 0;
    let i1 = 10;
    let page = 1;

    let description = 
        `Serveurs: ${this.client.guilds.cache.size}\n\n`+
    this.client.guilds.cache.sort((a,b) => b.memberCount-a.memberCount).map((r) => r)
      .map((r, i) => `**${i + 1}** - ${r.name} | ${r.memberCount} Membres`)
      .slice(0, 10)
      .join("\n");

    const embed = new EmbedBuilder()
      .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
      .setColor(0x2f3136)
      .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
      .setTitle(`Page: ${page}/${Math.ceil(this.client.guilds.cache.size/10)}`)
      .setDescription(description);

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('prev')
          .setLabel('⬅')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId('next')
          .setLabel('➡')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId('stop')
          .setLabel('❌')
          .setStyle(ButtonStyle.Danger)
      );

    const msg = await message.channel.send({ embeds: [embed], components: [row] });

    const collector = msg.createMessageComponentCollector({
      componentType: ComponentType.Button,
      filter: (interaction) => interaction.user.id === message.author.id,
      time: 300000 
    });

    collector.on("collect", async(interaction) => {

      if(interaction.customId === "prev") {

        i0 = i0-10;
        i1 = i1-10;
        page = page-1;
                
        if(i0 < 0){
          return msg.delete();
        }
        if(!i0 || !i1){
          return msg.delete();
        }
                
        description = `Serveurs: ${this.client.guilds.cache.size}\n\n`+
        this.client.guilds.cache.sort((a,b) => b.memberCount-a.memberCount).map((r) => r)
          .map((r, i) => `**${i + 1}** - ${r.name} | ${r.memberCount} Membres`)
          .slice(i0, i1)
          .join("\n");

        const updatedEmbed = new EmbedBuilder()
          .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
          .setColor(0x2f3136)
          .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
          .setTitle(`Page: ${page}/${Math.round(this.client.guilds.cache.size/10)}`)
          .setDescription(description);
            
        await interaction.update({ embeds: [updatedEmbed], components: [row] });
            
      }

      if(interaction.customId === "next"){

        i0 = i0+10;
        i1 = i1+10;
        page = page+1;

        if(i1 > this.client.guilds.cache.size + 10){
          return msg.delete();
        }
        if(!i0 || !i1){
          return msg.delete();
        }

        description = `Serveurs: ${this.client.guilds.cache.size}\n\n`+
        this.client.guilds.cache.sort((a,b) => b.memberCount-a.memberCount).map((r) => r)
          .map((r, i) => `**${i + 1}** - ${r.name} | ${r.memberCount} Membres`)
          .slice(i0, i1)
          .join("\n");

        const updatedEmbed = new EmbedBuilder()
          .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
          .setColor(0x2f3136)
          .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
          .setTitle(`Page: ${page}/${Math.round(this.client.guilds.cache.size/10)}`)
          .setDescription(description);
            
        await interaction.update({ embeds: [updatedEmbed], components: [row] });

      }

      if(interaction.customId === "stop"){
        return msg.delete(); 
      }

    });

    collector.on('end', async () => {

      const disabledRow = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('prev_disabled')
            .setLabel('⬅')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true),
          new ButtonBuilder()
            .setCustomId('next_disabled')
            .setLabel('➡')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true),
          new ButtonBuilder()
            .setCustomId('stop_disabled')
            .setLabel('❌')
            .setStyle(ButtonStyle.Danger)
            .setDisabled(true)
        );
      
      try {
        await msg.edit({ components: [disabledRow] });
      } catch (error) {
      }
    });
  }

}

module.exports = ServersList;