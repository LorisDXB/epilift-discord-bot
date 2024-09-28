import * as config from "../../include/config.mjs"
import { EmbedBuilder } from "discord.js";
import * as utility from "../utility.mjs";

export async function showWallet(message, parsedCommand, db, client) {
    try {
        const userId = message.author.id;
        const result = await fetchUserBalance(db, userId)

        if (result) {
            const walletEmbed = getWalletEmbed(message.author, result);
            message.reply({embeds: [walletEmbed]});
        } else {
            message.reply("*I don't have a wallet, maybe I should ask Loris to give me one.*")
        }
    } catch (error) {
        console.error(utility.getErrorMessage("showWallet.mjs l16", error));
        message.reply("Couldn't create the wallet.");
    }
}

async function fetchUserBalance(db, userId) {
    const query = `SELECT * FROM bank WHERE userId = ?`;

    return new Promise((resolve, reject) => {
        db.get(query, [userId], (error, row) => {
            if (error) {
                reject(new Error(utility.getErrorMessage("showWallet.mjs l27", error)));
            } else {
                resolve(row);
            }
        });
    });
}

function getWalletEmbed(user, result) {
    const walletEmbed = new EmbedBuilder(config.walletEmbed);

    walletEmbed
        .setTitle(`${user.username}'s wallet :dollar:`)
        .addFields(
            {name: `*You have*`, value: `**__${result.wallet}__ liftCoins**`},
        )
        .setThumbnail(user.displayAvatarURL())
        .setColor(utility.fetchRandomEmbedColor());
    return walletEmbed;
}