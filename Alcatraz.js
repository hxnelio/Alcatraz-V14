const config = require('./config.json');
const Client = require('./src/Client.js');
const { GatewayIntentBits, EmbedBuilder, Events } = require('discord.js');

global.__basedir = __dirname;

const intents = [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.GuildVoiceStates,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
  GatewayIntentBits.GuildMessageReactions
];

const client = new Client(config, { intents: intents });

function init() {
  client.loadEvents('./src/events');
  client.loadCommands('./src/commands');
  client.login(client.token);
}

init();
    client.on(Events.GuildCreate, async guild => {
  
        let canal = client.channels.cache.get("775339804765454396")
        
             const embed = new EmbedBuilder()
            .setThumbnail(guild.iconURL())
            .setTitle("`➕` Alcatraz a rejoint un serveur")
            .setDescription("Merci à **"+ guild.members.cache.get(guild.ownerId)?.user?.tag || "Utilisateur inconnu" +"** de m'avoir ajouté dans son serveur, je suis maintenant dans **"+ client.guilds.cache.size +" serveurs**.\n\n__Informations du serveur :__\n• :pencil: **Nom:** "+ guild.name +"\n• :mortar_board: **Rôles:** "+guild.roles.cache.size+"\n• :man_detective: **Membres:** "+guild.memberCount+"\n• :id: **ID:** "+guild.id+"\n• :crown: **Propriétaire:** "+ guild.members.cache.get(guild.ownerId)?.user?.tag || "Utilisateur inconnu" +"")
            .setTimestamp()
            .setColor(0x1fd10f)
            .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
        
            canal.send({ embeds: [embed] });
        });

    client.on(Events.GuildDelete, async guild => {

        let canal = client.channels.cache.get("775339804765454396")

        const embed = new EmbedBuilder()
        .setThumbnail(guild.iconURL())
        .setTitle("`➖` Alcatraz a quitté un serveur")
        .setDescription("Dommage **"+ guild.members.cache.get(guild.ownerId)?.user?.tag || "Utilisateur inconnu" +"** viens de m'exclure de son serveur, je ne suis plus que dans **"+ client.guilds.cache.size +" serveurs**.\n\n__Informations du serveur :__\n• :pencil: **Nom:** "+ guild.name +"\n• :mortar_board: **Rôles:** "+guild.roles.cache.size+"\n• :man_detective: **Membres:** "+guild.memberCount+"\n• :id: **ID:** "+guild.id+"\n• :crown: **Propriétaire:** "+ guild.members.cache.get(guild.ownerId)?.user?.tag || "Utilisateur inconnu" +"")
        .setTimestamp()
        .setColor(0xd90e0b)
        .setFooter({ text: "© 2025 - Alcatraz | Projet open-source" })
        
            canal.send({ embeds: [embed] });
        });

process.on('unhandledRejection', err => client.logger.error(err));