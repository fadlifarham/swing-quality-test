export const Middleware = (
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	middlewares: any[] = []
): MethodDecorator => {
	return (target, propertyKey: string, descriptor): void => {
		// In case this is the first route to be registered the `routes` metadata is likely to be undefined at this point.
		// To prevent any further validation simply set it to an empty array here.
		if (!Reflect.hasMetadata("middleware", descriptor.value)) {
			Reflect.defineMetadata("middleware", [], descriptor.value);
		}

		Reflect.defineMetadata("middleware", middlewares, descriptor.value);
	};
};