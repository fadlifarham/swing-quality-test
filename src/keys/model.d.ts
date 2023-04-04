import { Model, FindOptions, Sequelize } from "sequelize";

/**
 * Abstract class to be extended by models
 * declare the default structure of a model
 * TODO need to define the model.d.ts
 */
export abstract class BaseModel<
	T extends {} = any,
	K extends {} = any
> extends Model<T, K> {
	public static readonly modelName: string;
	public static readonly modelNamePlural: string;
	public static readonly tableName: string;
	public static readonly defaultScope: FindOptions;

	/**
	 * Method to initialize the model
	 */
	public static modelInit(sequelize: Sequelize): void;
}
