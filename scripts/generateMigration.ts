import yargs from "yargs";
import { generateFile } from "./generateHelper";

const argv = yargs
	.option("name", {
		alias: "n",
		description: "Set the name of th migration",
		type: "string",
	})
	.help()
	.alias("help", "h").argv;

let fileName = "migration-file";

if (argv.name) {
	fileName = argv.name;
}

const contentToWrite = [
	'import { QueryInterface, DataTypes } from "sequelize";',
	"",
	"export const up = async (query: QueryInterface): Promise<void> => {",
	"	try {",
	"		/**",
	"		 * code for migration to run",
	"		 */",
	"		return query.createTable(Model.tableName, {",
	"			id: {",
	"				type: DataTypes.INTEGER,",
	"				primaryKey: true,",
	"				allowNull: false,",
	"				autoIncrement: true,",
	"			},",
	"			createdAt: {",
	"				type: DataTypes.DATE,",
	"			},",
	"			updatedAt: {",
	"				type: DataTypes.DATE,",
	"			},",
	"		});",
	"	} catch (error) {",
	"		return Promise.reject(error);",
	"	}",
	"};",
	"",
	"export const down = async (query: QueryInterface): Promise<void> => {",
	"	try {",
	"		/**",
	"		 * code wher migration revert to run",
	"		 */",
	"	} catch (error) {",
	"		return Promise.reject(error);",
	"	}",
	"};",
	"",
];

/**
 * run generate
 * * path need end with / till path resolve work
 * TODO fix first param with path resolve
 */
generateFile("./src/migrations/", fileName, contentToWrite);
