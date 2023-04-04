import { Response, NextFunction, Request } from "express";

interface IRule {
  type: "param" | "query" | "body",
  field: string,
  required?: boolean,
  dataType?: "string" | "number" | "boolean" | "object"
}

export const validator = (rules: IRule[]) => {
  return function (req: Request, res: Response, next: NextFunction) {
    const bodies = req.body;
    const params = req.params;
    const queries = req.query;
    for (const rule of rules) {
      let value;
      switch (rule.type) {
        case "param":
          value = params[rule.field];
          break;
        case "query":
          value = queries[rule.field];
          break;
        case "body":
          value = bodies[rule.field];
          break;
      }
      if (rule.required && typeof value == "undefined") {
        return res.status(400).json({
          success: false,
          message: `Field '${rule.field}' is required`
        });
      }

      if (rule.dataType) {
        if (typeof value != rule.dataType) {
          return res.status(400).json({
            success: false,
            message: `Field '${rule.field}' must be ${rule.dataType}`
          });
        }
      }
    }
    next();
  };
};
