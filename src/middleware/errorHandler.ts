import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../utils";

export const errorHandler = (
	err: Error,
	_: Request,
	res: Response,
	_2: NextFunction
): void => {
	let error: ErrorResponse = { ...err, statusCode: 500 };
	error.message = err.message;

	/**
	 * for logging the error in console
	 * TODO need more tweak to get more informative error
	 */

	/**
	 * Handling specific error
	 */
	switch (err.name) {
		case "JsonWebTokenError":
			error = new ErrorResponse("Invalid token", 422);
			break;
		case "TokenExpiredError":
			error = new ErrorResponse("Token Invalid", 401);
			break;
	}

	/**
	 * Response error
	 */
	res.status(error.statusCode || 500).json({
		status: "error",
		message: error.message || "Internal Server Error",
	});
};
