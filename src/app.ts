import express, { Application, Request, Response } from "express";
import swaggerUi, { SwaggerUiOptions } from "swagger-ui-express";
import { RouteDefinition } from "./interfaces/RouteDefinition.interface";
import { asyncHandler, errorResponse, successResponse, isSuccessMsg, SuccessMessage } from "./utils";
import { apiDoc } from "./utils/generateApiDoc";
import { swaggerSchemas } from "./models";
import path from "path";
import staticGzip from "express-static-gzip";
import { ServerResponse } from "http";
import { _Request } from "./interfaces";

class App {
  public app: Application
  private swaggerOption: SwaggerUiOptions = {
    swaggerOptions: {
      filter: true
    }
  };

  constructor(appInit: { middleWares: any; controllers?: any; actions?: any }) {
    this.app = express();
    const schemas = swaggerSchemas;

    for (const schema of schemas) {
      const routeSchemas = Object.keys(schema);
      for (const currentSchema of routeSchemas) {
        if (typeof apiDoc.components.schemas[currentSchema] == "undefined") {
          apiDoc.components.schemas[currentSchema] = schema[currentSchema];
        }
      }
    }

    this.actions(appInit.actions);
    this.middlewares(appInit.middleWares);
    this.routes(appInit.controllers);
  }

  private async actions(actions: {
    forEach: (arg0: (action: any) => void) => void
  }) {
    actions.forEach(async (action) => {
      if (action.type) {
        await action.action(this.app);
      } else {
        await action();
      }
    });
  }

  private middlewares(middleWares: {
    forEach: (arg0: (middleWare: any) => void) => void
  }) {
    middleWares.forEach((middleWare) => {
      this.app.use(middleWare);
    });
  }

  private routes(controllers: {
    forEach: (arg0: (controller: any) => void) => void
  }) {
    controllers.forEach((controller) => {
      const instance = new controller();
      const prefix = Reflect.getMetadata("prefix", controller);
      const routes: Array<RouteDefinition> = Reflect.getMetadata(
        "routes",
        controller
      );
      routes.forEach((route) => {
        const middlewares = Reflect.getMetadata("middleware", instance[route.methodName]);
        const params = Reflect.getMetadata("param", instance, route.methodName) || [];
        const queries = Reflect.getMetadata("query", instance, route.methodName) || [];
        const requests = Reflect.getMetadata("request", instance, route.methodName) || [];
        const responses = Reflect.getMetadata("response", instance, route.methodName) || [];
        const currentusers = Reflect.getMetadata("current-user", instance, route.methodName) || [];
        const originalMethod = instance[route.methodName];
        this.app[route.requestMethod](
          `/api/v1${prefix}${route.path}`,
          middlewares ? middlewares[0] : route.middlewares,
          asyncHandler(async (req: _Request, res: express.Response) => {
            try {
              instance[route.methodName] = (...args: any) => {
                // method decorator
                for (const param of params) {
                  const {
                    key,
                    parameterIndex,
                  } = param;

                  if (!key) {
                    args[parameterIndex] = req.params;
                  } else {
                    args[parameterIndex] = req.params[key];
                  }
                }

                for (const query of queries) {
                  const {
                    key,
                    parameterIndex,
                  } = query;

                  if (!key) {
                    args[parameterIndex] = req.query;
                  } else {
                    args[parameterIndex] = req.query[key];
                  }
                }

                for (const request of requests) {
                  const {
                    parameterIndex,
                  } = request;
                  args[parameterIndex] = req;
                }

                for (const response of responses) {
                  const {
                    parameterIndex,
                  } = response;
                  args[parameterIndex] = res;
                }

                for (const currentUser of currentusers) {
                  const {
                    parameterIndex,
                  } = currentUser;
                  args[parameterIndex] = req.user;
                }

                return originalMethod.apply(this, args);
              };

              const data = await instance[route.methodName](req, res);
              if (isSuccessMsg(data)) {
                return successResponse({
                  res,
                  data: undefined,
                  msg: (<SuccessMessage>data).msg
                });
              } else if (data instanceof ServerResponse) {
                return data;
              }
              return successResponse({
                res,
                data
              });
            } catch (e) {
              console.error({ e });
              return errorResponse({ res, msg: e, statusCode: e.statusCode || 500 });
            }
          })
        );
        const paths = route.apiDoc.paths;
        const routePaths = Object.keys(paths);

        for (const path of routePaths) {
          const currentPath = `${prefix}${path}`;
          if (typeof apiDoc.paths[currentPath] == "undefined") {
            apiDoc.paths[currentPath] = paths[path];
          } else {
            const httpMethodKeys = Object.keys(paths[path]);
            for (const httpMethod of httpMethodKeys) {
              if (typeof apiDoc.paths[currentPath][httpMethod] != "undefined") {
                console.error(`There are duplicate route with base route '${currentPath}' on Method [${httpMethod.toUpperCase()}] ${controller.name} with tag "${apiDoc.paths[currentPath][httpMethod].tags[0]}"`);
              }
            }
            apiDoc.paths[currentPath] = {
              ...apiDoc.paths[currentPath],
              ...paths[path]
            };
          }
        }
      });
    });

    this.app.use(
      "/explorer",
      swaggerUi.serve,
      swaggerUi.setup(apiDoc, this.swaggerOption)
    );

    this.app.use("*", async (req: Request, res: Response) => {
      res.status(404);
      res.json({
        message: "sorry bos, alamat yang anda tuju tidak terdaftar"
      });
    });
  }
}

export default App;
