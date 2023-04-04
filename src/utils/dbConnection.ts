/* eslint-disable @typescript-eslint/no-explicit-any */
import { Sequelize } from "sequelize";
import { development, production, local } from "../config/postgres.config";
import { 
	development as mongoDevelopment,
	test as mongoTest, 
	production as mongoProduction, 
	local as mongoLocal
} from "../config/mongo.config";
import { envConfig } from "./envConfig";
// import { mongo } from "mongoose";

let psqlConfig, mongoConfig;

switch (envConfig.NODE_ENV) {
	case "development":
		psqlConfig = development;
		mongoConfig = mongoDevelopment;
		break;
	case "local":
		psqlConfig = local;
		mongoConfig = mongoLocal;
		break;
	case "production":
		psqlConfig = production;
		mongoConfig = mongoProduction;
		break;
}

const mongo_credential = {
	username: mongoConfig.username,
	password: mongoConfig.password,
	database: mongoConfig.database,
	host: mongoConfig.host,
	port: mongoConfig.port
};

const mongoose_mongo_url = `mongodb://${mongo_credential.username}:${mongo_credential.password}@${mongo_credential.host}:${mongo_credential.port}/${mongo_credential.database}?authSource=admin&readPreference=primary&ssl=false`;

if (typeof psqlConfig == "undefined" && envConfig.NODE_ENV == "development") {
  psqlConfig = {
    database: envConfig.DB_NAME,
    username: envConfig.DB_USERNAME,
    password: envConfig.DB_PASSWORD,
    host: envConfig.DB_HOST,
    port: envConfig.DB_PORT,
  };
}

const sequelize_postgres: any = new Sequelize(
	psqlConfig.database,
	psqlConfig.username,
	psqlConfig.password,
	{
		dialect: "postgres",
		host: psqlConfig.host,
		port: psqlConfig.port
	}
);

export { mongoose_mongo_url, sequelize_postgres };
