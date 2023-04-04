import {
	Controller,
	Get
} from "../decorators";
import {
	Request
} from "express";
import Role from "../models/role.model";
import {
	Op
} from "sequelize";

@Controller("/roles")
export default class RoleController {

	@Get({
		path: "/",
		tag: "RoleController"
	}, {
		responses: [{
			200: {
				description: "Response get object",
				responseType: "array",
				schema: "Role"
			}
		}]
	})
	public async gets(): Promise < Role[] > {
		const roles = await Role.findAll({
			where: {
				name: {
					[Op.notIn]: ["SUPERADMIN"]
				}
			}
		});
		
		return roles;
	}

	@Get({
		path: "/:id",
		tag: "RoleController"
	}, {
		responses: [{
			200: {
				description: "Response get object",
				responseType: "object",
				schema: "Role"
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
	public async getById(req: Request): Promise < Role > {
		const {
			id
		} = req.params;
		const role = await Role.findOne({
			where: {
				id
			},
		});

		return role;
	}
}
