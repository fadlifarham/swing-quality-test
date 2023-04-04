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
export interface RoleAttributes {
	id: number;
	name: string;
}

export type RoleCreationAttributes = Optional<RoleAttributes, "id">;

export class Role extends BaseModel<RoleAttributes, RoleCreationAttributes>
	implements RoleAttributes {
	public static readonly tableName = "MT_Role";
	public static readonly modelName = "Role";
	public static readonly modelNamePlural = "Roles";
	public static readonly defaultScope = {};
	public id!: number;
	public name!: string;
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
	public readonly deletedAt!: Date;

	public static associations: {};

	public static setAssociation(): void { }
	
	public static tableDefinitions: ModelAttributes<Role, RoleAttributes> = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING
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
		Role: {
			title: "",
			properties: {
				id: {
					type: "number",
				},
				name: {
					type: "string",
				},
				menus: {
					type: "array",
					items: {
						properties: {
							id: {
								type: "number"
							},
							url: {
								type: "string"
							},
							label: {
								type: "string"
							},
							subMenus: {
								type: "array",
								items: {
									properties: {
										id: {
											type: "number"
										},
										url: {
											type: "string"
										},
										label: {
											type: "string"
										}
									}
								}
							}
						}
					}
				}
			},
		},
		NewRole: {
			title: "",
			properties: {
				name: {
					type: "string",
				},
				menuIds: {
					type: "array",
					items: {
						type: "number"
					}
				}
			},
		},
	}
];

export default Role;
