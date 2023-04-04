export const Param = (key: string = null): ParameterDecorator => {
  return (
    target,
    propertyKey: string | symbol,
    parameterIndex: number
  ): void => {
    const parameters: { key: string, parameterIndex: number }[] = Reflect.getOwnMetadata("param", target, propertyKey) || [];
    parameters.push({ key, parameterIndex });
    Reflect.defineMetadata("param", parameters, target, propertyKey);
  };
};
