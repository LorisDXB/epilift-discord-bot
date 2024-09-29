import sqlite3 from "sqlite3";

export function setupDataBase() {
	let db = new sqlite3.Database("db/db.sqlite", (error) => {
		if (error) {
			console.error(utility.getErrorMessage("db.mjs l6", error));
		} else {
			try {
				createStatisticsDB(db);
				createBankDb(db);
			} catch (error) {
				console.error(utility.getErrorMessage("db.mjs l12", error));
			}
		}
	});
	return db;
}

function createStatisticsDB(db) {
	// return new Promise((resolve, reject) => {
	db.run(`CREATE TABLE IF NOT EXISTS statistics (
				userId VARCHAR(128) PRIMARY KEY UNIQUE,
				squat INTEGER,
				bench INTEGER,
				deadlift INTEGER,
				sbd INTEGER)`, error => {
					if (error) {
						console.error(utility.getErrorMessage("db.mjs l28", error));
					}
				});
}

function createBankDb(db) {
	db.run(`CREATE TABLE IF NOT EXISTS bank (
			userId VARCHAR(128) PRIMARY KEY UNIQUE,
			wallet INTEGER)`, error => {
				if (error) {
					console.error(utility.getErrorMessage("db.mjs l38", error));
				}
			});
}
