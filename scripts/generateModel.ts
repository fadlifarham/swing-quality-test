import yargs from "yargs";
import { generateFileWithoutTs, appendToaFile } from "./generateHelper";

const argv = yargs
	.option("name", {
		alias: "n",
		description: "Set the name of th seeder",
		type: "string",
	})
	.help()
	.alias("help", "h").argv;

let modelName = "model-file";

if (argv.name) {
	modelName = argv.name.replace(/^./, argv.name[0].toUpperCase());
} else {
	console.error("please provide model name");
}

const contentToWrite = [
	'import { Optional, Sequelize, DataTypes } from "sequelize";',
	'import { BaseModel } from "../utils";',
	"",
	"/**",
	" * Schema Model Definition",
	" */",
	`export interface ${modelName}Attributes {`,
	"	/**",
	"	 * sample attribute",
	"	 */",
	"	id: number;",
	"}",
	"",
	`export type ${modelName}CreationAttributes = Optional<${modelName}Attributes, "id">`,
	"",
	"/**",
	" * Class Register",
	" */",
	`export class ${modelName} extends BaseModel<${modelName}Attributes, ${modelName}CreationAttributes>`,
	`	implements ${modelName}Attributes {`,
	"	/**",
	"	 * Define Main Model Information",
	"	 */",
	`	public static readonly tableName = "${modelName}s";`,
	`	public static readonly modelName = "${modelName}";`,
	`	public static readonly modelNamePlural = "${modelName}s";`,
	"	public static readonly defaultScope = {};",
	"",
	"	/**",
	"	 * Register model parameter",
	"	 */",
	"	public id!: number; // sample, replace if needed",
	"",
	"	/**",
	"	 * Register default parameter",
	"	 */",
	"	public readonly createdAt!: Date;",
	"	public readonly updatedAt!: Date;",
	"",
	"	public static modelInit(sequlize: Sequelize): void {",
	"		this.init(",
	"			{",
	"				/**",
	"				 * Register all parameter to",
	"				 * sequelize object",
	"				 */",
	"				id: {",
	"					type: DataTypes.INTEGER,",
	"					primaryKey: true,",
	"					autoIncrement: true,",
	"				},",
	"			},",
	"			{",
	"				sequelize: sequlize,",
	"				tableName: this.tableName,",
	"				name: {",
	"					singular: this.modelName,",
	"					plural: this.modelNamePlural,",
	"				},",
	"				defaultScope: this.defaultScope,",
	`				comment: "Model for the accessible data of ${modelName.toLowerCase()}",`,
	"			}",
	"		);",
	"	}",
	"",
	"	public static setAssociation(): void {}",
	"}",
	"",
];

/**
 * run generate
 * * path need end with / till path resolve work
 * TODO fix first param with path resolve
 */
generateFileWithoutTs(
	"./src/models/",
	modelName.toLowerCase() + ".model.ts",
	contentToWrite
);

/**
 * content to add a line
 */
const aLine = `export * from "./${modelName.toLowerCase()}.model";`;

/**
 * process add a file
 */
appendToaFile("./src/models/index.ts", aLine);
