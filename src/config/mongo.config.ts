import { envConfig } from "../utils";

const {
	MONGO_DB_USERNAME,
	MONGO_DB_PASSWORD,
	MONGO_DB_HOST,
	MONGO_DB_PORT,
	MONGO_DB_NAME,
} = envConfig;

const config = {
	"local": {
		"username": "mongo",
		"password": "sandiaman",
		"database": "dummy",
		"host": "192.168.100.71",
		"port": "27017"
	},
	"test": {
		"username": "mongo",
		"password": "sandiaman",
		"database": "dummy",
		"host": "192.168.100.71",
		"port": "27017"
	},
	"production": {
		"username": "mongo",
		"password": "sandiaman",
		"database": "boilerplate",
		"host": "dryblend-mongo",
		"port": "27017"
	}
};


export const development = {
	username: MONGO_DB_USERNAME,
	password: MONGO_DB_PASSWORD,
	host: MONGO_DB_HOST,
	port: +MONGO_DB_PORT,
	database: MONGO_DB_NAME,
};

export const local = config.local;

export const production = config.production;

export const test = config.test;
