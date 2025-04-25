import * as utility from "../utility.mjs";
import { EmbedBuilder } from "discord.js";
import * as config from "../../include/config.mjs";

export async function showProgression(message, parsedCommand, db, client) {
	const targetUserId = parsedCommand.arguments[0] ? parsedCommand.arguments[0].slice(2, -1) : message.author.id;
    const error = await argumentRobustness(targetUserId, client);
    
	if (error) {
		message.reply("These arguments are invalid.");
		return;
	}
    try {
        const progressionTable = await getProgressionTable(db, targetUserId);
        if (!progressionTable) {
            throw new Error("showProgression: Couldn't fetch progression for: ", targetUserId);
        }

        const progressionGraphURL = await getProgressionGraph(progressionTable);

        if (progressionGraphURL) {
            const progressionEmbed = await getProgressionEmbed(targetUserId, progressionGraphURL, client);

            message.reply({embeds: [progressionEmbed]});
        }
    } catch (error) {
		console.error(utility.getErrorMessage("showProgression.mjs l28", error));
		message.reply("Couldn't get progression.");
    }
}

async function getProgressionEmbed(userId, progressionGraphURL, client) {
    const user = await client.users.fetch(userId);
    const walletEmbed = new EmbedBuilder(config.progressionEmbed);

    walletEmbed
        .setTitle(`${user.username}'s progression :chart_with_upwards_trend:`)
        .setImage(progressionGraphURL)
        .setColor(utility.fetchRandomEmbedColor());
    return walletEmbed;
}

async function getProgressionGraph(progressionTable)
{
    const dateTable = progressionTable.map(d => d.date);
    const sbdTable = progressionTable.map(d => d.sbd);

    const chartUrl = 'https://quickchart.io/chart?c=' + encodeURIComponent(JSON.stringify({
        type: 'line',
        data: {
          labels: dateTable,
          datasets: [{ label: `SBD`, data: sbdTable }]
        }
    }));

    return chartUrl
}

async function getProgressionTable(db, targetUserId) {
    const query = "SELECT * FROM statstore WHERE userId = ?";

    return new Promise((resolve, reject) => {
        db.all(query, [targetUserId], (error, rows) => {
            if (error) {
                reject(new Error(utility.getErrorMessage("showWallet.mjs l27", error)));
            } else {
                resolve(rows);
            }
        });
    });
}

async function argumentRobustness(targetUserId, client) {
	const isUser = await utility.isAUser(targetUserId, client);

	if (!isUser) {
        console.log("wasn't user: ", targetUserId);
        return true;
    }
	return false;
}