import * as utility from "../utility.mjs";

export async function takeMoney(message, parsedCommand, db, client) {
	const targetUserId = parsedCommand.arguments[0] ? parsedCommand.arguments[0].slice(2, -1) : null;
    const error = await argumentRobustness(parsedCommand, targetUserId, client); 

    if (error) {
        message.reply("These arguments are invalid.");
        return;
    }
    try {
        const newBalance = await getNewBalance(db, targetUserId, Number(parsedCommand.arguments[1]));

        if (newBalance < 0) {
            message.reply("Insufficient funds.");
            return;
        }

        const result = await updateWallet(db, targetUserId, newBalance)

        if (result) {
            message.reply("Took money successfully.");
        } else {
            message.reply("Couldn't take money from this user.")
        }
    } catch (error) {
        console.error("takeMoney.mjs l21", error);
        message.reply("Couldn't take money from this user.")
    }
}

async function argumentRobustness(parsedCommand, targetUserId, client) {
	const isUser = await utility.isAUser(targetUserId, client);
    const amount = Number(parsedCommand.arguments[1]);

	if (!isUser) return true;
	if (parsedCommand.arguments.length < 2) return true;
    if (isNaN(amount) || amount <= 0) return true;
	return false;
}

async function getNewBalance(db, targetUserId, moneyToGive) {
    const query = `SELECT wallet FROM bank WHERE userId = ?`;

    try {
        const result = await new Promise((resolve, reject) => {
            db.get(query, [targetUserId], (error, row) => {
                if (error) {
                    reject(new Error(utility.getErrorMessage("takeMoney.mjs l42", error)));
                } else {
                    resolve(row);
                }
            });
        });

        if (result?.wallet !== undefined) {
            return result.wallet - moneyToGive;
        } else {
            throw new Error("takeMoney.mjs l52");
        }
    } catch (error) {
        console.error(utility.getErrorMessage("takeMoney.mjs l55", error));
        return -1;
    }
}

async function updateWallet(db, targetUserId, newBalance) {
    const query = `UPDATE bank SET wallet = ? WHERE userId = ?`;
    
    return utility.executeQuery(db, query, [newBalance, targetUserId]);
}