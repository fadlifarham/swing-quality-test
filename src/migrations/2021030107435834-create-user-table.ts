import { QueryInterface } from "sequelize";
import User from "../models/user.model";

export const up = async (query: QueryInterface): Promise<void> => {
	try {
		return await User.createTable(query);
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
