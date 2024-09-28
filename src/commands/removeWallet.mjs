import * as utility from "../utility.mjs";

export async function removeWallet(message, parsedCommand, db, client) {
	const targetUserId = parsedCommand.arguments[0] ? parsedCommand.arguments[0].slice(2, -1) : null;
    const error = await argumentRobustness(parsedCommand, targetUserId, client); 

    if (error) {
        message.reply("These arguments are invalid.");
        return;
    }
    try {
        const query = `DELETE FROM bank WHERE userId = ?`
        const result = await utility.executeQuery(db, query, [targetUserId]);

        if (result) {
            message.reply("Wallet was removed successfully.");
        }
    } catch (error) {
        console.error("removeWallet.mjs l19", error);
        message.reply("Couldn't remove this wallet.");
    }
}

async function argumentRobustness(parsedCommand, targetUserId, client) {
	const isUser = await utility.isAUser(targetUserId, client);

	if (!isUser) return true;
	if (parsedCommand.arguments.length < 1) return true;
	return false;
}