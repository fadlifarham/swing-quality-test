export const Request = (): ParameterDecorator => {
  return (
    target,
    propertyKey: string | symbol,
    parameterIndex: number
  ): void => {
    const parameters: { key: string, parameterIndex: number }[] = Reflect.getOwnMetadata("request", target, propertyKey) || [];
    parameters.push({ key: null, parameterIndex });
    Reflect.defineMetadata("request", parameters, target, propertyKey);
  };
};
