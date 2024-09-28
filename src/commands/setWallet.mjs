import * as utility from "../utility.mjs";

export async function setWallet(message, parsedCommand, db, client) {
	const targetUserId = parsedCommand.arguments[0] ? parsedCommand.arguments[0].slice(2, -1) : null;
    const error = await argumentRobustness(parsedCommand, targetUserId, client); 

    if (error) {
        message.reply("These arguments are invalid.");
        return;
    }
    try {
        const queryFunction = await fetchQueryFunction(db, targetUserId);
        const result = await queryFunction(db, targetUserId, parsedCommand)

        if (result) {
            message.reply("Created wallet successfully.");
        }
    } catch (error) {
        console.error("setWallet.mjs l19", error);
        message.reply("Couldn't fetch wallet info.");
    }
}

async function argumentRobustness(parsedCommand, targetUserId, client) {
	const isUser = await utility.isAUser(targetUserId, client);

	if (!isUser) return true;
	if (parsedCommand.arguments.length < 2) return true;
	return false;
}

async function fetchQueryFunction(db, targetUserId) {
    const query = "SELECT * FROM bank WHERE userId = ?";

    return new Promise((resolve, reject) => {
        db.get(query, [targetUserId], (error, row) => {
            if (error) {
                reject(new Error(utility.getErrorMessage("setWallet.mjs l38", error)));
            } else {
                resolve(row ? updateWallet : createWallet);
            }
        });
    });
}

export async function updateWallet(db, targetUserId, parsedCommand) {
    const query = `UPDATE bank SET wallet = ? WHERE userId = ?`;

    return utility.executeQuery(db, query, [parsedCommand.arguments[1], targetUserId]);
}

async function createWallet(db, targetUserId, parsedCommand) {
    const query = `INSERT INTO bank (userId, wallet) VALUES (?, ?)`;

    return utility.executeQuery(db, query, [targetUserId, parsedCommand.arguments[1]]);
}