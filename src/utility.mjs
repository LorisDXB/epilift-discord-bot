import * as config from "../include/config.mjs";

export function extractLifts(parsedCommand) {
	const squat = Number(parsedCommand.arguments[1]);
	const bench = Number(parsedCommand.arguments[2]);
	const deadlift = Number(parsedCommand.arguments[3]);

	return {squat, bench, deadlift, sbd: squat + bench + deadlift};
}

export async function isAUser(userId, client) {
	if (isNaN(userId)) {
		return false;
	}
	try {
		const user = await client.users.fetch(userId);

		return !!user;
	} catch (error) {
		console.error(getErrorMessage("isAUser", error));
		return false;
	}
}

export async function userHasPermissions(message, command) {
	const user = message.member;
	const requiredPermissions = config.permissionTable[command] ? config.permissionTable[command] : null;

	if (!requiredPermissions) {
		console.log("this command doesn't require permissions");
		return true;
	}
	try {
		const hasPermissions = user.permissions.has(requiredPermissions);

		if (hasPermissions) {
			console.log("this user has permission");
			return true;
		} else {
			message.reply("You do not have the required permissions to execute this command.");
			return false;
		}
	} catch (error) {
		console.error(getErrorMessage("utility.mjs l45", error));
		message.reply("Couldn't verify your permissions !");
		return false;
	}
}

export async function executeQuery(db, query, args) {
	return new Promise((resolve, reject) => {
		db.run(query, args, error => {
			if (error) {
				reject(new Error(getErrorMessage("utility.mjs l54", error)));
			} else {
				console.log("data updated successfully");
				resolve(true);
			}
		});
	});
}

export async function getUserRank(db, targetUserId) {
	const query = `SELECT * FROM statistics ORDER BY sbd DESC`;

	try {
		const result = await new Promise((resolve, reject) => {
			db.all(query, (error, rows) => {
				if (error) {
					reject(new Error(getErrorMessage("utility.mjs l71", error)));
				}
				resolve(rows);
			});
		});
		for (let i = 0; i < result.length; i++) {
			const user = result[i];

			if (user.userId == targetUserId) {
				return i + 1;
			}
		}
		return -1;
	} catch (error) {
		console.error(getErrorMessage("utility.mjs", l71));		
		return -1;
	}
}

export function getErrorMessage(errorInfo, error) {
	return `ERROR ${errorInfo}: ${error.message}`;
}

export function fetchRandomEmbedColor() {
	const colors = [
		'#FF5733',
		'#33FF57',
		'#3357FF',
		'#FF33A8',
		'#33FFF5'
	];

	return colors[Math.floor(Math.random() * colors.length)];
}
