const Command = require('../Alcatraz.js');
const figlet = require("figlet");
const util = require("util");
const figletAsync = util.promisify(figlet);

module.exports = class Ascii extends Command {

  constructor (client) {
    super(client, {
      name: 'ascii',
      usage: 'ascii <texte>',
      description: 'Transformez votre texte en caractères ascii ! (moins de 20 caractères)',
      type: client.types.FUN,
      examples: ['ascii Bonjour tout le monde!']

    });
  }

	async run (message, args) {

    const text = args.join(" ");

    if(text.length > 20){
      return message.error("Veuillez préciser un texte de moins de 20 caractères !");
    }

		const rendered = await figletAsync(text);
		message.channel.send("```" + rendered + "```");

	}

};