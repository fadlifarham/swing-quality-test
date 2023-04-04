import * as dotenv from "dotenv";
dotenv.config();

export const envConfig = {
	NODE_ENV: process.env.NODE_ENV || "development",
	PORT: +(process.env.PORT || 3000),
	DB_USERNAME: process.env.DB_USERNAME || "postgres",
	DB_PASSWORD: process.env.DB_PASSWORD || "sandiaman",
	DB_HOST: process.env.DB_HOST || "localhost",
	DB_PORT: +(process.env.DB_PORT || 5432),
	DB_NAME: process.env.DB_NAME || "swing",
	DB_DIALECT: process.env.DB_DIALECT ? "postgres" : "postgres",
	JWT_EXPIRE: process.env.JWT_EXPIRE || "8h",
	JWT_SECRET: process.env.JWT_SECRET || "sandiamanbro",
	// mongo
	MONGO_DB_USERNAME: process.env.MONGO_DB_USERNAME || "mongo",
	MONGO_DB_PASSWORD: process.env.MONGO_DB_PASSWORD || "sandiaman",
	MONGO_DB_HOST: process.env.MONGO_DB_HOST || "localhost",
	MONGO_DB_PORT: process.env.MONGO_DB_PORT || "27017",
	MONGO_DB_NAME: process.env.MONGO_DB_NAME || "swing",

	BASE_URL: process.env.BASE_URL || "http://localhost:4002",
  SECRET_KEY: process.env.SECRET_KEY || "mysecretisverysecret",
};
