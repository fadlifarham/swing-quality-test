import { Request, NextFunction, Response } from "express";
import { ValidationError, validationResult } from "express-validator";
import { ErrorResponse } from "./errorResponse";

export const validationFailResponse = (
	res: Response,
	errorMessage: ValidationError[]
): Response => {
	return res.status(422).json({
		message: "Validation Fail",
		data: errorMessage,
	});
};

/**
 * this for next plan, validation helper
 * TODO make this work
 * @param req Request Param
 * @param next Next Function Express
 */
export const validationResultHelper = (
	req: Request,
	next: NextFunction
): void => {
	const error = validationResult(req);
	if (error) {
		return next(new ErrorResponse("Validation Fail", 422));
	}
	next();
};
