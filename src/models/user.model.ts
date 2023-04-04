import {
	Optional,
	Sequelize,
	DataTypes,
	QueryInterface,
	Association,
	ModelAttributes,
} from "sequelize";
import { BaseModel } from "../utils";

import { Schemas } from "../keys/apidoc";
import Role from "./role.model";

export interface UserAttributes {
	id: number;
	email: string;
	password: string;
	fullName?: string;
	phoneNumber?: string;
	avatarUrl?: string;
	roleId: number;
	lastLoginAt?: Date;
}

export type UserCreationAttributes = Optional<UserAttributes, "id">;

export class User extends BaseModel<UserAttributes, UserCreationAttributes>
	implements UserAttributes {
	public static readonly tableName = "MT_User";
	public static readonly modelName = "User";
	public static readonly modelNamePlural = "Users";
	public static readonly defaultScope = {};
	public id!: number;
	public email: string;
	public password!: string;
	public fullName?: string;
	public phoneNumber?: string;
	public avatarUrl?: string;
	public roleId!: number;
	public lastLoginAt?: Date;

	// RELATIONS
	public role?: Role;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
	public readonly deletedAt!: Date;

	public static associations: {
		role: Association<User, Role>
	};

	public static setAssociation(): void {
		this.belongsTo(Role, { foreignKey: "roleId", as: "role" });
	}

	public static tableDefinitions: ModelAttributes<User, UserAttributes> = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
		email: {
			type: new DataTypes.STRING(),
		},
		password: new DataTypes.STRING(),
		fullName: new DataTypes.STRING(),
		phoneNumber: new DataTypes.STRING(),
		avatarUrl: new DataTypes.STRING(),
		roleId: new DataTypes.INTEGER(),
		lastLoginAt: new DataTypes.DATE()
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
				comment: "Model for the accessible data of user",
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
		User: {
			title: "",
			properties: {
				id: {
					type: "number",
				},
				username: {
					type: "string",
				},
				firstName: {
					type: "string",
				},
				lastName: {
					type: "string",
				},
				avatarUrl: {
					type: "string"
				},
				lineId: {
					type: "number",
				},
				areaId: {
					type: "number",
				},
				stepId: {
					type: "number",
				},
				lastLoginAt: {
					type: "string",
				},
			},
		},
		NewUser: {
			title: "",
			properties: {
				username: {
					type: "string",
				},
				password: {
					type: "string"
				},
				firstName: {
					type: "string",
				},
				lastName: {
					type: "string",
				},
				avatarUrl: {
					type: "string"
				},
				lineId: {
					type: "number",
				},
				areaId: {
					type: "array",
					items: {
						type: "number"
					}
				},
				stepId: {
					type: "number",
				},
				roleId: {
					type: "number",
				},
			},
		},
		UpdateUser: {
			title: "",
			properties: {
				username: {
					type: "string",
				},
				firstName: {
					type: "string",
				},
				lastName: {
					type: "string",
				},
				avatarUrl: {
					type: "string"
				},
				lineId: {
					type: "number",
				},
				areaId: {
					type: "array",
					items: {
						type: "number"
					}
				},
				stepId: {
					type: "number",
				},
				roleId: {
					type: "number",
				},
			},
		},
	}
];

export default User;
