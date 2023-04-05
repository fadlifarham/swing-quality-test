/* eslint-disable @typescript-eslint/no-explicit-any */
import { Sequelize } from "sequelize";
import { development, production, local } from "../config/postgres.config";
import { envConfig } from "./envConfig";

let psqlConfig;

switch (envConfig.NODE_ENV) {
	case "development":
		psqlConfig = development;
		break;
	case "local":
		psqlConfig = local;
		break;
	case "production":
		psqlConfig = production;
		break;
}

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

export { sequelize_postgres };
