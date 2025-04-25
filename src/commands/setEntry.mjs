import * as utility from "../utility.mjs";
import * as config from "../../include/config.mjs";

export async function setEntry(message, parsedCommand, db, client) {
	const targetUserId = parsedCommand.arguments[0] ? parsedCommand.arguments[0].slice(2, -1) : null;
	const error = await argumentRobustness(parsedCommand, targetUserId, client);

	if (error) {
		message.reply("These arguments are invalid.")
		return;
	}
	try {
		const result = await fetchQueryFunction(db, targetUserId);
		const success = result ? await updateUser(parsedCommand, db, targetUserId, result)
			: await addNewUser(parsedCommand, db, targetUserId);

		if (success) {
			message.reply("User added or updated successfully!");	
			updateRoles(message, db, targetUserId);
		}
	} catch (error) {
		console.error(utility.getErrorMessage("setEntry.mjs l19", error));
		message.reply("Entry failed.");
	}
}

async function argumentRobustness(parsedCommand, targetUserId, client) {
	const isUser = await utility.isAUser(targetUserId, client);

	if (!isUser) return true;
	for (let arg of parsedCommand.arguments.slice(1)) {
		const argElem = Number(arg);

		if (isNaN(argElem)) {
			return true;
		}
	}
	return false;
}

async function fetchQueryFunction(db, userIdToAdd) {
	const sql = `SELECT * FROM statistics WHERE userId = ?`;
	
	return new Promise((resolve, reject) => {
		db.get(sql, [userIdToAdd], (error, row) => {
			if (error) {
				reject(new Error(utility.getErrorMessage("setEntry.mjs l44", error)));
			} else {
				resolve(row);
			}
		});
	});	
}

async function updateRoles(message, db, targetUserId) {
	const sql = `SELECT sbd FROM statistics WHERE userId = ?`;

	try {
		//retrieve sbd
		const result = await new Promise((resolve, reject) => {
			db.get(sql, [targetUserId], (error, row) => {
				if (error) {
					reject(new Error(utility.getErrorMessage("setEntry.mjs l62", error)));
				} else {
					resolve(row);
				}
			});
		});
		if (result?.sbd !== undefined) {
			assignSbdRole(message, targetUserId, result)
		} else {
			throw new Error(`setEntry.mjs l72: ${error}`);
		}
	} catch (error) {

	}
}

async function assignSbdRole(message, targetUserId, result) {
	const newRoleId = getSbdRole(result.sbd);
	const newRole = await message.guild.roles.cache.get(newRoleId);
	const targetUser = await message.guild.members.fetch(targetUserId);

	const ready = await prepareRankUp(targetUser, newRoleId);

	if (ready && newRole) {
		await targetUser.roles.add(newRole);
		message.channel.send(`<@${targetUserId}> ranked up to <@&${newRoleId}>`);
	}
}

async function prepareRankUp(targetUser, newRoleId) {
	let sbdRolesId = config.sbdRoles.map(role => role.roleId);
	let userRoles = await targetUser.roles.cache;
	let userRolesKeys = userRoles.map(role => role.id);

	for (const role of userRolesKeys) {
		if (role == newRoleId) {
			return false;
		}
	}
	userRolesKeys.forEach(roleId => {
		if (sbdRolesId.includes(roleId)) {
			targetUser.roles.remove(roleId);
		}
	});
	return true;	
}

function getSbdRole(sbd) {
	return config.sbdRoles.find(role => sbd < role.maxSbd).roleId;
}

async function addNewUser(parsedCommand, db, targetUserId) {
	const lifts = utility.extractLifts(parsedCommand);
	const query = `INSERT INTO statistics (userId, squat, bench, deadlift, sbd) VALUES (?, ?, ?, ?, ?)`;

	return utility.executeQuery(db, query, [targetUserId, lifts.squat, lifts.bench, lifts.deadlift, lifts.sbd]); 
}

async function updateUser(parsedCommand, db, targetUserId, currentStats) {
	const lifts = utility.extractLifts(parsedCommand);
	const query = `UPDATE statistics SET squat = ?, bench = ?, deadlift = ?, sbd = ? WHERE userId = ?`;

	await storeCurrentStats(currentStats, db, targetUserId);
	return utility.executeQuery(db, query, [lifts.squat, lifts.bench, lifts.deadlift, lifts.sbd, targetUserId]); 
}

async function storeCurrentStats(currentStats, db, targetUserId) {
	const query = `INSERT INTO statstore (userId, date, sbd) VALUES (?, ?, ?)`;

    return utility.executeQuery(db, query, [targetUserId, new Date.toLocaleDateString(), currentStats]);
}