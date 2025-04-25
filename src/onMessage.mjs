import * as config from "../include/config.mjs";
import * as utility from "./utility.mjs";
import { lookUpUser } from "./commands/lookUp.mjs";
import { randomExercise } from "./commands/randExercise.mjs";
import { setEntry } from "./commands/setEntry.mjs";
import { showLeaderboard } from "./commands/showLeaderboard.mjs";
import { removeEntry } from "./commands/removeEntry.mjs";
import { clearMessages } from "./commands/clearMessage.mjs";
import { setWallet } from "./commands/setWallet.mjs";
import { showWallet } from "./commands/showWallet.mjs";
import { removeWallet } from "./commands/removeWallet.mjs";
import { giveMoney } from "./commands/giveMoney.mjs";
import { takeMoney } from "./commands/takeMoney.mjs";
import { helpMenu } from "./commands/help.mjs";
import { showProgression } from "./commands/showProgression.mjs";

const nonUserCommandTable = { //basic commands
	randexercise: randomExercise,
	clear: clearMessages,
	help: helpMenu
}

const userCommandTable = { //commands needing db access and client validation
	setentry: setEntry,
	leaderboard: showLeaderboard,
	lookup: lookUpUser,
	removeentry: removeEntry,
	setwallet: setWallet,
	wallet: showWallet,
	removewallet: removeWallet,
	givemoney: giveMoney,
	takemoney: takeMoney,
	progression: showProgression
}

export async function handleMessages(message, db, client) {
	const parsedCommand = parseCommand(message);

	if (!parsedCommand || !await utility.userHasPermissions(message, parsedCommand.command)) return;

	if (nonUserCommandTable[parsedCommand.command]) {
		nonUserCommandTable[parsedCommand.command](message, parsedCommand);
	} else if (userCommandTable[parsedCommand.command]) {
		userCommandTable[parsedCommand.command](message, parsedCommand, db, client);
	} else {
		message.reply("Please, enter a valid command.");
	}
}

function parseCommand(message) {
	let parsedCommand = {}
	let messageArray = message.content.slice(1).trim().split(/\s+/);

	if (message.author.bot) {
		return null;
	}
	if (message.content.length == 0) {
		return null;
	}
	if (message.content[0] != config.prefix) {
		return null;
	}
	parsedCommand.command = messageArray[0].toLowerCase();
	parsedCommand.arguments = messageArray.slice(1).map(d => d.toLowerCase());
	return parsedCommand;
}
