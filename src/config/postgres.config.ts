import { Options } from "sequelize";
import { envConfig } from "../utils";

interface _Options extends Options {
	seederStorage?: "json" | "sequelize";
}

const {
	DB_USERNAME,
	DB_PASSWORD,
	DB_HOST,
	DB_PORT,
	DB_NAME,
	DB_DIALECT
} = envConfig;

const config = {
	local: {
		username: "postgres",
		password: "sandiaman",
		database: "dummy",
		host: "192.168.1.50",
		port: 5432,
	},
	test: {
		username: "postgres",
		password: "sandiaman",
		database: "dummy",
		host: "192.168.1.50",
		port: 5432,
	},
	production: {
		username: "postgres",
		password: "sandiaman",
		database: "dummy",
		host: "192.168.1.50",
		port: 5432,
	},
};

export const development: _Options = {
	username: DB_USERNAME,
	password: DB_PASSWORD,
	host: DB_HOST,
	port: +DB_PORT,
	database: DB_NAME,
	dialect: DB_DIALECT ? "postgres" : "postgres",
	seederStorage: "sequelize",
};

export const local: _Options = {
	...config.local,
	dialect: DB_DIALECT ? "postgres" : "postgres",
	seederStorage: "sequelize",
};

export const production: _Options = {
	...config.production,
	dialect: DB_DIALECT ? "postgres" : "postgres",
	seederStorage: "sequelize",
};
