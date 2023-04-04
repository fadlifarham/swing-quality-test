import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { _Request } from "../interfaces";
import { envConfig } from "../utils";
import User from "../models/user.model";

interface Claims {
	user: number
}

interface TokenDecode {
	claims: Claims,
	iat: number,
	exp: number
}

export function tokenExtractor(token: string): string {
	const extracted = token.split(" ")[1];

	if (!extracted) throw "Error no Bearer auth token provided";
	
	return extracted;
}

// TODO: add expired time when reach thresshold
export const auth = async (req: _Request, res: Response, next: NextFunction): Promise<Response> => {
	let authHeader: string;
	let token: string;

	try {
		authHeader = req.headers["authorization"];

		if (!authHeader) throw "Error no authorization header";

		token = tokenExtractor(authHeader);

		jwt.verify(token, envConfig.JWT_SECRET, async (err, decoded: TokenDecode) => {
			if (err) {
				if (err.name == "TokenExpiredError") {
					// token expired
					return res.status(500).json({
						sucess: false,
						message: "Token expired"
					});
				}
			}
			if (err) throw err;
			const user = await User.findOne({
				where: {
					id: decoded.claims.user
				},
				attributes: {
					exclude: ["password"]
				},
				include: [
					{
						attributes: {
							exclude: ["createdAt", "updatedAt", "deletedAt"]
						},
						association: User.associations.role,
						as: "role"
					}
				]
			});
			req.user = user;
			next();
		});
	} catch (e) {
		return res.status(500).json({
			sucess: false,
			message: e
		});
	}
};
