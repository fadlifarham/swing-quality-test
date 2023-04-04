/* eslint-disable @typescript-eslint/no-var-requires */
import { sequelize_postgres, mongoose_mongo_url } from "../utils/dbConnection";
import { Schemas } from "../keys/apidoc";
import mongoose, { mongo } from "mongoose";
import fs from "fs";

let files = fs.readdirSync(`${__dirname}`);
files = files.filter((x: string) => {
	return !x.includes("index.") && !x.includes("mongo.model") && !x.includes(".map");
});
export let swaggerSchemas: Schemas[] = [];
const models = files.map((d: string) => {
	const fileName = `./${d}`.replace(".ts", "");
	const model = require(fileName);
	const schemas = model["swaggerSchemas"];
	if (typeof schemas != "undefined") {
		swaggerSchemas = [...swaggerSchemas, ...schemas];
	}
	return model["default"];
});

const mongoose_mongo = mongoose;

const modelInit = (): void => {
	mongoose_mongo.connect(mongoose_mongo_url, { useNewUrlParser: true, useUnifiedTopology: true });

	models.forEach((model: any) => {
		model.modelInit(sequelize_postgres);
	});

	models.forEach((model: any) => {
		model.setAssociation();
	});
};

export { mongoose_mongo };
export default modelInit;
