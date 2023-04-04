import {
  Schemas,
  Response,
  Paths,
  ItemModel,
  RequestBody,
  ParameterItem
} from "../keys/apidoc";
import { getSchemaResponse, getSchemaRequest } from "./index";
export interface ResponseSwagger {
  [statusCode: number]: {
    description: string;
    // eslint-disable-next-line @typescript-eslint/ban-types
    schema: string | ItemModel | object;
    responseType: "array" | "object";
  };
}

export interface Payload {
  responses: ResponseSwagger[];
  request?: string | ItemModel;
  parameters?: ParameterItem[];
}
export const GenerateApiDoc = (
  properties: { path: string; tag?: string; method: string },
  schemas: Schemas[],
  payload: Payload
): { paths: Paths; schemas: Schemas[] } => {
  const paths: any = {};
  const responses: Response = {};
  let requestBody: RequestBody;
  const convertPathToSwagger = (path: string): string => {
    const arrayPaths = path.split("/");
    if (arrayPaths.length <= 0) return path;
    const processedPath = arrayPaths.map((x: string) => {
      if (x.includes(":")) {
        const tokenizedPath = x.replace(":", "");
        x = `{${tokenizedPath}}`;
      }
      return x;
    });
    return processedPath.join("/");
  };

  properties.path = convertPathToSwagger(properties.path);
  // maping request body
  if (payload.request) {
    if (typeof payload.request == "string") {
      requestBody = {
        content: {
          "application/json": {
            schema: getSchemaRequest(payload.request)
          },
          "multipart/form-data": {
            schema: getSchemaRequest(payload.request)
          }
        }
      };
    } else {
      requestBody = {
        content: {
          "application/json": {
            schema: payload.request
          },
          "multipart/form-data": {
            schema: payload.request
          }
        }
      };
    }
  }
  // mapping responses
  for (const response of payload.responses) {
    const statusCodes = Object.keys(response);
    const responseBodies = Object.values(response);
    for (let i = 0; i < statusCodes.length; i++) {
      let schema: ItemModel;
      if (typeof responseBodies[i].schema == "string") {
        schema = getSchemaResponse(
          responseBodies[i].description,
          responseBodies[i].schema,
          responseBodies[i].responseType
        );
      } else {
        schema = responseBodies[i].schema;
      }
      responses[Number(statusCodes[i])] = {
        description: responseBodies[i].description,
        content: {
          "application/json": {
            schema
          }
        }
      };
    }
  }
  paths[properties.path] = {};
  paths[properties.path][properties.method] = {
    tags: [properties.tag],
    responses,
    requestBody,
    parameters: payload.parameters
  };

  const apiDoc: { paths: Paths; schemas: Schemas[] } = {
    paths,
    schemas
  };
  return apiDoc;
};

export const apiDoc: any = {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "Belovewed Backend",
    description: "This starting point to develop be using TS",
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT"
    }
  },
  servers: [
    {
      url: "/api/v1"
    }
  ],
  authAction: {
    JWT: {
      name: "JWT",
      schema: {
        type: "apiKey",
        in: "header",
        name: "Authorization",
        description: "sda"
      },
      value: "Bearer <JWT>"
    }
  },
  security: [
    {
      Bearer: [""]
    }
  ],
  paths: {},
  components: {
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          status: {
            type: "string"
          },
          message: {
            type: "string"
          }
        }
      }
    },
    securitySchemes: {
      Bearer: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    }
  }
};
