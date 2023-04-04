/* eslint-disable @typescript-eslint/ban-types */
import { genSalt, hash } from "bcryptjs";
import { QueryInterface } from "sequelize";
import Role from "../models/role.model";
import User from "../models/user.model";
import { sequelize_postgres } from "../utils/dbConnection";

export const up = async (query: QueryInterface): Promise<object | number> => {
	sequelize_postgres.options.logging = false;

	Role.modelInit(sequelize_postgres);
	const date = {
		createdAt: new Date(),
		updatedAt: new Date()
	};
	
	
	try {
		const password = await hash("password", await genSalt(12));	
		const [superadminRole, adminRole, guestRole] = await Role.findAll();

		const users = [
			{
				email: "superadmin@example.com",
				fullName: "Superadmin Dev",
				password,
				roleId: superadminRole.id,
				...date
			},
			{
				email: "admin@example.com",
				fullName: "Admin Dev",
				password,
				roleId: adminRole.id,
				...date
			},
			{
				email: "guest@example.com",
				fullName: "Guest Dev",
				password,
				roleId: guestRole.id,
				...date
			},
		];

		await query.bulkInsert(User.tableName, users);

		return Promise.resolve({});
	} catch (error) {
		return Promise.reject(error);
	}
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const down = async (query: QueryInterface): Promise<object | number> => {
	try {
		/**
		 * code will execute on revert seeder
		 */
		return Promise.resolve({});
	} catch (error) {
		return Promise.reject(error);
	}
};
