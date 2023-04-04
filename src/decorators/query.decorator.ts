export const Query = (key: string = null): ParameterDecorator => {
  return (
    target,
    propertyKey: string | symbol,
    parameterIndex: number
  ): void => {
    const parameters: { key: string, parameterIndex: number }[] = Reflect.getOwnMetadata("query", target, propertyKey) || [];
    parameters.push({ key, parameterIndex });
    Reflect.defineMetadata("query", parameters, target, propertyKey);
  };
};
