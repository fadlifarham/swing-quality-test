import { QueryInterface } from "sequelize";
import Product from "../models/product.model";

export const up = async (query: QueryInterface): Promise<void> => {
	try {
		return await Product.createTable(query);
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
