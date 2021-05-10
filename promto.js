const Discord = require("discord.js");
const fetch = require("node-fetch");
const cron = require("cron");
const bot = new Discord.Client();
const config = require("./config");
const prefix = "!";

var allowedEmoji = Array(
	":relieved:",
	":smiling_face_with_tear:",
	":heart_eyes:",
	":grinning:",
	":joy:",
	":rofl:",
	":wink:",
	":relieved:",
	":smiling_face_with_tear:",
	":heart_eyes:",
	":wolf:",
	":kissing_smiling_eyes:",
	":kissing_cat:",
	":yum:",
	":stuck_out_tongue_winking_eye:",
	":stuck_out_tongue_closed_eyes:",
	":bug:",
	":poop:",
	":clap:",
	":handshake:",
	":thumbsup:",
	":punch:",
	":fist:",
	":v:",
	":muscle:",
	":mechanical_arm:",
	" :pray:",
	":foot:",
	":leg:",
	":nerd:",
	":mechanical_leg:",
	" :kiss:",
	" :lips:",
	" :tooth:",
	" :bone:",
	" :ear_with_hearing_aid:",
	" :brain:",
	":man_detective:",
	":bat:",
	":wolf:"
);

/*
returns a random emoji from allowedEmoji list
*/
randomEmoji = function () {
	console.log(Math.floor(Math.random() * allowedEmoji.length));
	var rand = Math.floor(Math.random() * allowedEmoji.length);
	return allowedEmoji[rand]; //dosent work ?????
};

/*
resets timing function
*/
function leftToEight() {
	var d = new Date();
	return -d + d.setHours(8, 0, 0, 0);
}

/*
returns random string from stands4 api for poems 

issue
returns an unfifiled promise and string is every possible string

*/
async function randPoem() {
	let getPoem = async () => {
		//make API call
		var terms = Array("grass", "gray", "happy");
		var term = terms[rand(0, terms.length - 1)];
		let result = await fetch(
			"https://www.stands4.com/services/v2/poetry.php?uid=8843&tokenid=" +
				config.POEM_TOKEN +
				"&term=" +
				term +
				"&format=json"
		);
		//convert to object we can work with
		let json = await result.json();
		return json;
	};
	//call function defined above
	let poem = await getPoem();

	//prints twice
	console.log(poem.result[0].poem);
	return poem.result[rand(0, poem.result.length - 1)].poem;
}

/*
returns random number from low to high
*/
function rand(min, max) {
	var offset = min;
	var range = max - min + 1;

	var randomNumber = Math.floor(Math.random() * range) + offset;
	return randomNumber;
}

/*
returns a string of threre random emojis 
that do not repeat within the set
*/
UniqueSetOfEmoji = function () {
	var set = " ";
	var count = 0;
	while (count != 3) {
		var newemoji = randomEmoji();
		if (!set.includes(newemoji)) {
			set += newemoji;
			count++;
		}
	}
	return set;
};

/*happens when the bot is messaged */

var lastcmd = "";
bot.on("message", async (msg) => {
	//if our message doesnt start with our defined prefix, dont go any further into function

	/*
	// should be all custom emojis
	const emojiList = msg.guild.emojis
		.map((e, x) => x + " = " + e + " | " + e.name)
		.join("\n");

	allowedEmoji.append(emojiList);
    */

	if (!msg.content.startsWith(prefix)) {
		console.log("no prefix");
		return;
	}

	//slices off prefix from our message, then trims extra whitespace, then returns our array of words from the message
	const args = msg.content.slice(prefix.length).trim().split(" ");

	//splits off the first word from the array, which will be our command
	const command = args[0].toLowerCase();
	// check command
	if (command == "emoji") {
		var count = args[1] - 1;
		while (count > 0) {
			msg.reply(randomEmoji());
			count--;
		}
		msg.reply(randomEmoji());
		lastcmd = randomEmoji();
	}
	if (command == "poem") {
		var string = randPoem();
		console.log(string);
		msg.reply(" Poem - \n  " + string);
	}
	if (command == "prompt") {
		var count = args[1] - 1;
		if (count > 5) {
			msg.reply("ok be patient");
		}
		while (count > 0) {
			msg.reply(UniqueSetOfEmoji());
			count--;
		}
		msg.reply(UniqueSetOfEmoji());
		lastcmd = UniqueSetOfEmoji();
	}

	if (command == "num") {
		msg.reply(rand(0, args[1]));
		lastcmd = rand(0, args[1]);
	}
	if (command == "!") {
		if (lastcmd) {
			msg.reply(lastcmd);
		} else {
			msg.reply("IDK what the last command was sorry :(");
		}
	}

	/*
	setTimeout(function () {
		// in leftToEight() milliseconds run this:
		//sendMessage(); // send the message once
		var dayMillseconds = 1000 * 60 * 60 * 24 * 7;
		setInterval(function () {
			// repeat this every 24 hours now should do it onece a week
			sendMessage();
		}, dayMillseconds);
	}, leftToEight());
	//log any arguments passed with a commandw
	console.log(args);
    */
});

/*
send message to weekly prompt 
not yet sent or schedialed 
*/
bot.on("ready", () => {
	var d = new Date();
	var n = d.getDay();

	if (n == 4) {
		sendMessageToServer("weekly-prompts");
	} else {
		console.log("Not sending message today");
	}
});

function sendMessageToServer(ChannelToSend) {
	const channel = bot.channels.cache.find(
		(channel) => channel.name === ChannelToSend
	);
	channel.send(UniqueSetOfEmoji("@bot-testing"));
}

bot.login(config.DISCORD_TOKEN);
