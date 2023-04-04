/* eslint-disable @typescript-eslint/ban-types */
import { QueryInterface } from "sequelize";
import Role from "../models/role.model";

export const up = async (query: QueryInterface): Promise<object | number> => {
	const date = {
		createdAt: new Date(),
		updatedAt: new Date()
	};
	
	try {
		await query.bulkInsert(Role.tableName, [
			{
				name: "SUPERADMIN",
				...date
			},
			{
				name: "ADMIN",
				...date
			},
			{
				name: "GUEST",
				...date
			},
		]);
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
