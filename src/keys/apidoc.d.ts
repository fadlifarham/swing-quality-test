/**
 * to set item on schema or properties
 */
export interface ItemModel {
	/**
	 * Special property load from other schema
	 */
	$ref?: string;
	type?: "number" | "string" | "boolean" | "object" | "array" | "file";
	title?: string;
	properties?: Properties;
	required?: string[];
	items?: ItemModel;
	format?: "date-time" | "binary" | "password" | "email";
	enum?: string[];
	example?: Record<string, unknown>;
	[key: string]: unknown;
}

/**
 * define the properties
 */
export interface Properties {
	[key: string]: ItemModel;
}

/**
 * define model Schemas
 */
export interface Schemas {
	[key: string]: ItemModel;
}

/**
 * set content
 */
export interface Content {
	"application/json"?: {
		schema: ItemModel;
	};
	"multipart/form-data"?: {
		schema: ItemModel;
	};
}

/**
 * set Request Body
 */
export interface RequestBody {
	content: Content;
}

/**
 * set response Item
 */
export interface ResponseItem {
	description: string;
	content?: Content;
}

/**
 * set Response
 */
export interface Response {
	[key: number]: ResponseItem;
}

export interface SchemaParameter {
	type?: "string" | "number" | "file" | "binary" | "boolean";
	enum?: string[];
	required?: boolean;
}

/**
 * set Method Parameters Item
 */
export interface ParameterItem {
	name: string;
	in: "query" | "path";
	schema: Schemas | SchemaParameter;
	required?: boolean;
}

/**
 * set Method Item
 */
export interface MethodItem {
	tags: string[];
	responses?: Response;
	security?: string[],
	requestBody?: RequestBody;
	parameters?: ParameterItem[];
}

/**
 * set Paths
 */
export type Paths = {
	[url: string]: {
		[method in MethodName]?: MethodItem;
	};
};

/**
 * set Type for mmethod
 */
type MethodName = "get" | "post" | "put" | "patch" | "delete";

/**
 * Document per file
 */
export interface ApiDoc {
	schema: Schemas;
	paths: Paths;
}
