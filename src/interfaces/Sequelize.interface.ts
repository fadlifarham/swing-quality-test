import { QueryOptions } from "sequelize";

export interface QueryOpt extends QueryOptions {
	returning?: boolean
}
