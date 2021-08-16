const Discord = require("discord.js");
const bot = new Discord.Client(); //actual client bot
const config = require("./config"); //config file
const prefix = "!"; //command prefix !command

/*
ToDo:
functions into seperate files
more comments

set up Poll-o

steps
1. take the paramaters as a list 'args'
2. format args in message as poll
3. count and verify reactions
4. wait for time then count the reactions 
5. end reacting being allowed on message
*/


/*happens when the bot is messaged */

var lastcmd = "";
bot.on("message", async (msg) => {

	if (!msg.content.startsWith(prefix)) {
		console.log("no prefix");
		return;
	}

	//slices off prefix from our message, then trims extra whitespace, then returns our array of words from the message
	const args = msg.content.slice(prefix.length).trim().split(" ");

	//splits off the first word from the array, which will be our command
	const command = args[0].toLowerCase();
	// check command

	if (command == "!") {
		if (lastcmd) {
			msg.reply(lastcmd);
		} else {
			msg.reply("IDK what the last command was sorry :(");
		}
	}


});

bot.login(config.DISCORD_TOKEN);
