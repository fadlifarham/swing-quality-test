import { QueryInterface, DataTypes } from "sequelize";
import Store from "../models/store.model";

export const up = async (query: QueryInterface): Promise<void> => {
	try {
		return Store.createTable(query);
	} catch (error) {
		return Promise.reject(error);
	}
};

export const down = async (query: QueryInterface): Promise<void> => {
	try {
		/**
		 * code wher migration revert to run
		 */
	} catch (error) {
		return Promise.reject(error);
	}
};
