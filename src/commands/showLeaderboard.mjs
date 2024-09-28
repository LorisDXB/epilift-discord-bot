import { EmbedBuilder } from "discord.js";
import * as config from "../../include/config.mjs"
import * as utility from "../utility.mjs";

export async function showLeaderboard(message, parsedCommand, db) {
    const query = `SELECT * FROM statistics ORDER BY sbd DESC LIMIT 10`;

    try {
    const result = await new Promise((resolve, reject) => {
        db.all(query, (error, rows) => {
            if (error) {
                reject(new Error(utility.getErrorMessage("showLeaderboard.mjs l11", error)));
            } else {
                console.log("Leaderboard fetched successfully !");
                resolve(rows);
            }
        });
    });

    if (result) {
        const leaderboardEmbed = getLeaderboardEmbed(result)

        message.channel.send({embeds: [leaderboardEmbed]});
    }
    } catch (error) {
        console.error(utility.getErrorMessage("showLeaderboard.mjs l25", error));
        message.reply("Couldn't fetch leaderboard.");
    }

}

function getLeaderboardEmbed(result) {
    const embed = new EmbedBuilder(config.leaderboardEmbed);

    result.forEach((user, i) => {
        const userMedal = fetchUserMedal(i + 1);

        embed.addFields({ name: `${i + 1}st place ${userMedal}`,
            value: `<@${user.userId}>, **Sbd: ${user.sbd}kg**, Squat: ${user.squat}kg, Bench: ${user.bench}kg, Deadlift: ${user.deadlift}kg` });
    });
    embed.setColor(utility.fetchRandomEmbedColor());
    return embed;
}

function fetchUserMedal(userRank) {
    if (userRank == 1) {
        return ":first_place:"
    }
    if (userRank == 2) {
        return ":second_place:";
    }
    if (userRank == 3) {
        return ":third_place:";
    }
    return "";
}