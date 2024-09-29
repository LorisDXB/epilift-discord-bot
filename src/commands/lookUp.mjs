import * as config from "../../include/config.mjs";
import * as utility from "../utility.mjs";
import { EmbedBuilder } from "discord.js";

export async function lookUpUser(message, parsedCommand, db, client) {
	const targetUserId = parsedCommand.arguments[0] ? parsedCommand.arguments[0].slice(2, -1) : null;
    try {
        const result = await fetchUserData(targetUserId, db);
        const userRank = await utility.getUserRank(db, targetUserId); 

        if (result) {
            const lookUpEmbed = await getLookUpEmbed(client, result, userRank);

            message.reply({embeds: [lookUpEmbed]});
        } else {
            message.reply("This user isn't registered.");
        }
    } catch (error) {
        console.error(utility.getErrorMessage("lookUp.mjs l19", error));
        message.reply("Couldn't lookup user.");
    }
}

async function fetchUserData(targetUserId, db) {
    const query = `SELECT * FROM statistics WHERE userId = ?`;

    return new Promise((resolve, reject) => {
        db.get(query, [targetUserId], (error, row) => {
            if (error) {
                reject(new Error(utility.getErrorMessage("lookUp.mjs l30", error)));
            } else {
                console.log("fetched lookupdata");
                resolve(row);
            }
        });
    });
}

async function getLookUpEmbed(client, result, userRank) {
    const embed = new EmbedBuilder(config.lookUpEmbed);
    const targetUser = await client.users.fetch(result.userId);
    const medalTitle = fetchUserMedal(userRank);

    if (targetUser) {
        embed.setThumbnail(targetUser.displayAvatarURL());
    }
    embed.addFields({ name: `rank #${userRank} ${medalTitle}`, value: `<@${result.userId}>`},
                    { name: "sbd", value: `${result.sbd}kg` },
                    { name: "squat", value: `${result.squat}kg`, inline: true},
                    { name: "bench", value: `${result.bench}kg`, inline: true},
                    { name: "deadlift", value: `${result.deadlift}kg`, inline: true});
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