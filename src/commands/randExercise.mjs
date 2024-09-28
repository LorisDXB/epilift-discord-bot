import * as config from "../../include/config.mjs";
import { EmbedBuilder } from "discord.js";
import * as utility from "../utility.mjs";

export async function randomExercise(message, parsedCommand, db) {
	const bodyData = await fetchBodyData(message, parsedCommand);

	if (bodyData) {
		const embed = initExerciseEmbed(bodyData);

		message.channel.send({embeds: [embed]});
	}
}

async function fetchBodyData(message, parsedCommand) {
	try {
		const result = await fetch(`https://exercisedb.p.rapidapi.com/exercises/bodyPart/${parsedCommand.arguments[0]}?limit=10&offset=0`, {
			method: 'GET',
			headers: {
				"X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
				"X-RapidAPI-Key": process.env.EXDBKEY
			}
		});

		if (!result.ok) {
			throw new Error("Failed to fetch data from the API");
		}

		return result.json();
	} catch (error) {
		console.error(utility.getErrorMessage("randExercise.mjs l30", error));
		message.reply("Please, enter a valid body-part.");
	}
}

function initExerciseEmbed(bodyData) {
	let randomIndex = Math.floor(Math.random() * bodyData.length);

	const embed = new EmbedBuilder(config.exerciseEmbed)
		.setTitle(bodyData[randomIndex].name)
		.setDescription(bodyData[randomIndex].equipment)
		.setImage(bodyData[randomIndex].gifUrl);

	return embed;
}
