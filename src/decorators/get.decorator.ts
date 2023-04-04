import { RouteDefinition } from "../interfaces/RouteDefinition.interface";
import { GenerateApiDoc, Payload } from "../utils";

export const Get = (
  properties: { path: string; tag?: string; isIndependentRoute?: boolean },
  payload: Payload,
  middlewares: any[] = []
): MethodDecorator => {
  const isIndependentRoute =
    typeof properties.isIndependentRoute == "undefined"
      ? false
      : properties.isIndependentRoute;
  return (target, propertyKey: string): void => {
    if (typeof properties.tag == "undefined") {
      properties.tag = target.constructor.name;
    }
    // In case this is the first route to be registered the `routes` metadata is likely to be undefined at this point.
    // To prevent any further validation simply set it to an empty array here.
    if (!Reflect.hasMetadata("routes", target.constructor)) {
      Reflect.defineMetadata("routes", [], target.constructor);
    }

    // Get the routes stored so far, extend it by the new route and re-set the metadata.
    const routes = Reflect.getMetadata("routes", target.constructor) as Array<
      RouteDefinition
    >;

    const apiDoc = GenerateApiDoc(
      { ...properties, ...{ method: "get" } },
      [],
      payload
    );
    routes.push({
      requestMethod: "get",
      path: properties.path,
      methodName: propertyKey,
      apiDoc,
      middlewares,
      isIndependentRoute
    });
    Reflect.defineMetadata("routes", routes, target.constructor);
  };
};
