import * as onMessage from "./onMessage.mjs";

import { Client, GatewayIntentBits} from "discord.js";
import dotenv from "dotenv";
import { setupDataBase } from "./db.mjs";

dotenv.config();

const db = setupDataBase();

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent
	]
});

client.on("ready", () => {
	console.log("Bot is ready!");
});

client.on("messageCreate", (message) => {
	onMessage.handleMessages(message, db, client);
})

client.login(process.env.TOKEN);
