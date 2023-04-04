import { Response } from "express";
import { ItemModel } from "../keys/apidoc";
import { ErrorResponse } from "./index";

// Change the type to make not to ban types typescript
// eslint-disable-next-line @typescript-eslint/ban-types
export type DataType = object | object[];

/**
 * Resonponse with success message
 * @param res Reponse from express
 * @param data Model or Array of Model instance
 */
export const successResponse = (result: { res: Response; data?: any, msg?: string }): Response => {
	return result.res.status(200).json({
		success: true,
		data: result.data || undefined,
		message: result.msg ?? "Process was Successfully"
	});
};

export const errorResponse = (result: { res: Response, msg: string, statusCode: number } ): Response => {
	const error = new ErrorResponse(result.msg, result.statusCode);
	return result.res.status(result.statusCode).json({
		success: false,
		message: error.message
	});
};

/**
 * to build schema api docs on response section
 * @param title string of title
 * @param schemaName string name on schema object
 */
export const getSchemaResponse = (
	title: string,
	schemaName: string,
	typeDataResp: "array" | "object"
): ItemModel => {
	title = typeDataResp === "array" ? title + "s" : title;
	const data: ItemModel =
		typeDataResp === "array"
			? {
					type: "array",
					items: {
						$ref: "#/components/schemas/" + schemaName,
					},
			  }
			: { $ref: "#/components/schemas/" + schemaName };

	return {
		type: "object",
		title: title + ".Response",
		properties: {
			success: {
				type: "boolean"
			},
			message: {
				type: "string",
			},
			data,
		},
	};
};

/**
 * Get shcemas ref from Object Name
 * @param schemaName string of schema object
 */
export const getSchemaRequest = (schemaName: string): ItemModel => {
	return {
		$ref: "#/components/schemas/" + schemaName,
	};
};
