import * as utility from "../utility.mjs";
import { EmbedBuilder } from "discord.js";
import * as config from "../../include/config.mjs";

export async function showProgression(message, parsedCommand, db, client) {
	const targetUserId = parsedCommand.arguments[0] ? parsedCommand.arguments[0].slice(2, -1) : null;
    const error = argumentRobustness(targetUserId, client);
    
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
            const progressionEmbed = getProgressionEmbed(message.author, progressionGraphURL);

            message.reply({embeds: [progressionEmbed]});
        }
    } catch (error) {
		console.error(utility.getErrorMessage("setEntry.mjs l14", error));
		message.reply("Couldn't get progression.");
    }
}

function getProgressionEmbed(user, progressionGraphURL) {
    const walletEmbed = new EmbedBuilder(config.progressionEmbed);

    walletEmbed
        .setTitle(`${user.username}'s progression :emoji_5:`)
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

	if (!isUser) return true;
	return false;
}