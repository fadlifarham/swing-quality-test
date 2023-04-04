import {
	Controller,
	Get,
	Put,
	Post,
	Delete,
	Patch
} from "../decorators";
import {
	Request,
} from "express";
import {
	auth
} from "../middleware/auth";
import {
	genSalt,
	hash,
	compare
} from "bcryptjs";
import User from "../models/user.model";
import {
	ErrorResponse,
	SuccessMessage
} from "../utils";
import {
	_Request
} from "../interfaces";

@Controller("/users")
export default class UserController {
	@Post({
			path: "/"
		}, {
			responses: [{
				200: {
					description: "Response post object",
					responseType: "object",
					schema: "User"
				},
			}],
			request: "NewUser"
		},
		[auth]
	)
	public async create( req: Request ): Promise < User > {
		const input: User = req.body;
		const currentUser = await User.findOne({
			where: {
				email: input.email
			}
		});

		if (currentUser) throw "user exist";

		const salt = await genSalt(12);
		const hashPassword = await hash(input.password, salt);

		const user = await User.create({
			email: input.email,
			password: hashPassword,
			fullName: input.fullName,
			phoneNumber: input.phoneNumber,
			roleId: input.roleId,
			avatarUrl: input.avatarUrl
		});

		if (!user) throw "cant create user";

		return user;

	}

	@Get({
			path: "/current",
			isIndependentRoute: true
		}, {
			responses: [{
				200: {
					description: "Response get object",
					responseType: "object",
					schema: "User"
				}
			}]
		},
		[auth]
	)
	public async getCurrentUser( req: _Request ): Promise < User > {
		return req.user;
	}

	@Get({
		path: "/"
	}, {
		responses: [{
			200: {
				description: "Response get object",
				responseType: "array",
				schema: "User"
			}
		}]
	})
	public async getUsers(): Promise < User[] > {
		const users = await User.findAll({
			attributes: {
				exclude: ["password"],
			},
			include: [
				{
					attributes: ["id", "name"],
					association: User.associations.role
				}
			]
		});
		
		return users;
	}

	@Get({
		path: "/:id"
	}, {
		responses: [{
			200: {
				description: "Response get object",
				responseType: "object",
				schema: "User"
			}
		}],
		parameters: [{
			in: "path",
			name: "id",
			schema: {
				id: {
					type: "number"
				}
			},
			required: true
		}]
	})
	public async getUserById(req: Request): Promise < User > {
		const {
			id
		} = req.params;

		const user = await User.findOne({
			where: {
				id
			},
			attributes: {
				exclude: ["password"]
			},
			include: [{
				attributes: ["id", "name"],
				association: User.associations.role
			}]
		});

		if (!user) throw new ErrorResponse(`User with ID ${id} not found`, 404);

		return user;
	}

	@Put({
			path: "/:id"
		}, {
			responses: [{
				200: {
					description: "Response put object",
					responseType: "object",
					schema: "User"
				}
			}],
			request: "UpdateUser",
			parameters: [{
				name: "id",
				in: "path",
				schema: {
					type: "number",
				},
				required: true
			}]
		},
		[auth])
	public async update(req: Request): Promise < User > {
		const {
			id
		} = req.params;
		
		const input: User = req.body;

		const user = await User.findOne({
			where: {
				id
			},
			include: [{
				association: User.associations.role,
			}]
		});

		if (!user) throw {
			code: 404,
			message: `User with id ${id} not found`
		};

		const updateduser = await user.update(input);

		if (!updateduser) throw new ErrorResponse("Failed to update user", 400);

		return updateduser;
	}

	@Patch({
		path: "/"
		}, {
			responses: [{
				200: {
					description: "Response put object",
					responseType: "object",
					schema: {
						properties: {
							success: {
								type: "boolean"
							},
							msg: {
								type: "string"
							}
						}
					}
				}
			}],
			request: {
				type: "object",
				properties: {
					oldPassword: {
						type: "string"
					},
					newPassword: {
						type: "string"
					}
				}
			}
		},
		[auth])
	public async changeCurrentUserPassword(req: _Request): Promise < SuccessMessage > {
		const {
			oldPassword,
			newPassword
		} = req.body;

		const user = await User.findOne({
			where: {
				id: req.user.id
			},
		});

		const isValidPassword = await compare(oldPassword, user.password);

		if (!isValidPassword) throw {
			code: 400,
			message: "Your password is wrong"
		};

		const salt = await genSalt(12);
		const hashPassword = await hash(newPassword, salt);

		await user.update({
			password: hashPassword
		});

		return { msg: "Password successfully updated" };
	}

	@Patch({
			path: "/:id"
		}, {
			responses: [{
				200: {
					description: "Response put object",
					responseType: "object",
					schema: {
						properties: {
							success: {
								type: "boolean"
							},
							msg: {
								type: "string"
							}
						}
					}
				}
			}],
			request: {
				type: "object",
				properties: {
					newPassword: {
						type: "string"
					}
				}
			},
			parameters: [{
				name: "id",
				in: "path",
				schema: {
					type: "number",
				},
				required: true
			}]
		},
		[auth])
	public async changePassword(req: Request): Promise < SuccessMessage > {
		const {
			id
		} = req.params;
		
		const {
			newPassword
		} = req.body;

		const user = await User.findOne({
			where: {
				id
			},
		});

		if (!user) throw {
			code: 404,
			message: `User with id ${id} not found`
		};

		const salt = await genSalt(12);
		const hashPassword = await hash(newPassword, salt);

		await user.update({
			password: hashPassword
		});

		return { msg: `Password User with id ${id} successfully updated` };
	}

	@Delete({
			path: "/:id"
		}, {
			responses: [{
				200: {
					description: "Response delete array",
					responseType: "object",
					schema: {
						properties: {
							success: {
								type: "boolean"
							}
						}
					}
				}
			}]
		},
		[auth]
	)
	public async deleteUser(req: Request): Promise < SuccessMessage > {
		const {
			id
		} = req.params;
		const user = await User.findOne({
			where: {
				id
			},
			attributes: {
				exclude: ["password"]
			}
		});

		if (!user) throw new ErrorResponse(`User with id ${id} not found`, 400);

		await user.destroy();

		return { msg: `Successfully delete user with id ${id}` };
	}
}
