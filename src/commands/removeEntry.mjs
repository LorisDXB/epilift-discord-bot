import { executeQuery } from "../utility.mjs";
import * as utility from "../utility.mjs";

export async function removeEntry(message, parsedCommand, db) {
	try {
		const targetUserId = parsedCommand.arguments[0].slice(2, -1);
		const success = await deleteUser(db, targetUserId);

		if (success) {
			message.reply("User removed successfully!");	
		}
	} catch (error) {
		console.error(utility.getErrorMessage("removeEntry.mjs l12", error));
		message.reply("Entry couldn't be removed.");
	}
}

async function deleteUser(db, targetUserId) {
	const query = `DELETE FROM statistics WHERE userId = ?`;

	return executeQuery(db, query, [targetUserId]); 
}