const Command = require('../Alcatraz.js');
const { EmbedBuilder } = require('discord.js');

module.exports = class EvalCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'eval',
      usage: 'eval <code>',
      description: 'Exécute le code fourni et affiche la sortie.',
      type: client.types.OWNER,
      ownerOnly: true,
      examples: ['eval 1 + 1']
    });
  }
  run(message, args) {
    const input = args.join(' ');
    if (!input) return this.sendErrorMessage(message, 0, 'Veuillez fournir le code pour l\'évaluer');
    if(!input.toLowerCase().includes('token')) {

      const embed = new EmbedBuilder();

      try {
        let output = eval(input);
        if (typeof output !== 'string') output = require('util').inspect(output, { depth: 0 });
        
        embed
          .addFields(
            { name: 'Demande', value: `\`\`\`js\n${input.length > 1024 ? 'Trop grand pour être affiché.' : input}\`\`\`` },
            { name: 'Résultat', value: `\`\`\`js\n${output.length > 1024 ? 'Trop grand pour être affiché.' : output}\`\`\`` }
          )
          .setColor(0x66FF00);

      } catch(err) {
        embed
          .addFields(
            { name: 'Demande', value: `\`\`\`js\n${input.length > 1024 ? 'Trop grand pour être affiché.' : input}\`\`\`` },
            { name: 'Résultat', value: `\`\`\`js\n${err.length > 1024 ? 'Trop grand pour être affiché.' : err}\`\`\`` }
          )
          .setColor(0xFF0000);
      }

      message.channel.send({ embeds: [embed] });

    } else {
      message.channel.send('Oups, j\'ai failli donner mon Token, qu\'elle bouler.');
    }
  }
};