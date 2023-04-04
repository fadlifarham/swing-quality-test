import { QueryInterface } from "sequelize";
import Role from "../models/role.model";

export const up = async (query: QueryInterface): Promise<void> => {
	try {
		return await Role.createTable(query);
	} catch (error) {
		return Promise.reject(error);
	}
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const down = async (query: QueryInterface): Promise<void> => {
	try {
		/**
		 * code wher migration revert to run
		 */
	} catch (error) {
		return Promise.reject(error);
	}
};
