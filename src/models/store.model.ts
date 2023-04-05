/* eslint-disable @typescript-eslint/ban-types */
import {
	Optional,
	Sequelize,
	DataTypes,
	QueryInterface,
	ModelAttributes,
} from "sequelize";
import { BaseModel } from "../utils";

import { Schemas } from "../keys/apidoc";
export interface StoreAttributes {
	id: number;
	name: string;
  url: string;
  address: string;
  phone: string;
  operational_time_start: number;
  operational_time_end: number;
}

export type StoreCreationAttributes = Optional<StoreAttributes, "id">;

export class Store extends BaseModel<StoreAttributes, StoreCreationAttributes>
	implements StoreAttributes {
	public static readonly tableName = "MT_Store";
	public static readonly modelName = "Store";
	public static readonly modelNamePlural = "Stores";
	public static readonly defaultScope = {};
	public id!: number;
	public name!: string;
  public url: string;
  public address: string;
  public phone: string;
  public operational_time_start: number;
  public operational_time_end: number;
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
	public readonly deletedAt!: Date;

	public static associations: {};

	public static setAssociation(): void { }
	
	public static tableDefinitions: ModelAttributes<Store, StoreAttributes> = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
    url: DataTypes.STRING,
    address: DataTypes.TEXT,
    phone: DataTypes.STRING,
    operational_time_start: DataTypes.INTEGER,
    operational_time_end: DataTypes.INTEGER,
  }

	public static modelInit(sequlize: Sequelize): void {
		this.init(
			this.tableDefinitions,
			{
				sequelize: sequlize,
				tableName: this.tableName,
				name: {
					singular: this.modelName,
					plural: this.modelNamePlural,
				},
				defaultScope: this.defaultScope,
				comment: "Model for the accessible data of Line",
				paranoid: true
			}
		);
	}

	public static createTable(query: QueryInterface): Promise<void> {
		return query.createTable(this.tableName, {
			...this.tableDefinitions,
			createdAt: {
				type: DataTypes.DATE,
			},
			updatedAt: {
				type: DataTypes.DATE,
			},
			deletedAt: {
				type: DataTypes.DATE,
			},
		});
	}

	public static dropTable(query: QueryInterface): Promise<void> {
		return query.dropTable(this.tableName);
	}
}

export const swaggerSchemas: Schemas[] = [
	{
		Store: {
			title: "",
			properties: {
				name: {
					type: "string",
				},
        url: {
          type: "string"
        },
        address: {
          type: "string"
        },
        phone: {
          type: "string"
        },
        operational_time_start: {
          type: "number"
        },
        operational_time_end: {
          type: "number"
        },
			},
		},
		NewStore: {
			title: "",
			properties: {
				name: {
					type: "string",
				},
        url: {
          type: "string"
        },
        address: {
          type: "string"
        },
        phone: {
          type: "string"
        },
        operational_time_start: {
          type: "number"
        },
        operational_time_end: {
          type: "number"
        },
			},
		},
	}
];

export default Store;
