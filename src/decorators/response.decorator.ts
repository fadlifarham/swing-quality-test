export const Response = (): ParameterDecorator => {
  return (
    target,
    propertyKey: string | symbol,
    parameterIndex: number
  ): void => {
    const parameters: { key: string, parameterIndex: number }[] = Reflect.getOwnMetadata("response", target, propertyKey) || [];
    parameters.push({ key: null, parameterIndex });
    Reflect.defineMetadata("response", parameters, target, propertyKey);
  };
};
