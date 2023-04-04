import moment from "moment";
import {
  Op
} from "sequelize";
import { _Request } from "../interfaces";

interface IFilterRule {
  type?: "date",
  queryName?: string,
  dataType: "string" | "number" | "boolean" | "date" | "any",
  columnName?: string,
  data?: { [field: string]: any },
  isUsedLike?: boolean,
  isLowerCase?: boolean,
  isUpperCase?: boolean,
  in?: "query" | "params" | "body",
  defaultValue?: boolean | string | number | Date
}

/**
 *
 * @param req is _Request
 * @default limit = 20
 * @default pagination = 1
 */
export const createFilterOptions = (req: _Request, rules: IFilterRule[]): { [field: string]: any } => {
  const where: { [filed: string]: any } = {};
  for (const rule of rules) {
    const queries = rule.in ? req[rule.in] : req.query;
    const {
      isUpperCase,
      isLowerCase,
    } = rule;
    const isUsedLike = rule.isUsedLike ? true : false;
    if (rule.type == "date") {
      rule.columnName = rule.columnName ? rule.columnName : "createdAt";
      const {
        start_date,
        end_date,
        startDate,
        endDate,
      } = queries;
      if (typeof start_date !== "undefined" && typeof end_date !== "undefined") {
        const mStartDate = moment(start_date.toString()).toDate();
        const mEndDate = moment(end_date.toString()).add(1, "d").toDate();
        where[rule.columnName] = { [Op.between]: [mStartDate, mEndDate] };
      } else if (typeof startDate !== "undefined" && typeof endDate !== "undefined") {
        const mStartDate = moment(startDate.toString()).toDate();
        const mEndDate = moment(endDate.toString()).add(1, "d").toDate();
        where[rule.columnName] = { [Op.between]: [mStartDate, mEndDate] };
      }
    } else {
      const queryName = rule.queryName ? rule.queryName : rule.columnName;
      let query = queries[queryName] ? queries[queryName] : rule.defaultValue ? rule.defaultValue : undefined;
      const dataType = rule.dataType;
      if (typeof query != "undefined" && query.toString().toUpperCase() != "ALL") {
        const columnName = rule.columnName;
        if (dataType == "string") {
          if (isUpperCase) query = query.toString().toUpperCase();
          if (isLowerCase) query = query.toString().toLowerCase();
          if (isUsedLike) {
            where[columnName] = {
              [Op.iLike]: `%${query.toString()}%`
            };
          } else {
            where[columnName] = query.toString();
          }
        } else if (dataType == "number") {
          if (isUsedLike) {
            where[columnName] = {
              [Op.iLike]: `%${query.toString()}%`
            };
          } else {
            where[columnName] = parseInt(query.toString());
          }
        } else if (dataType == "boolean") {
          const bool = query == "true" ? true : false;
          where[columnName] = bool;
        } else {
          where[columnName] = rule.data[query.toString()];
        }
      }
    }
  }
  return where;
};
