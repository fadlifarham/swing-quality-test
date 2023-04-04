export const CurrentAuth = (): ParameterDecorator => {
  return (
    target,
    propertyKey: string | symbol,
    parameterIndex: number
  ): void => {
    const parameters: { key: string, parameterIndex: number }[] = Reflect.getOwnMetadata("current-user", target, propertyKey) || [];
    parameters.push({ key: null, parameterIndex });
    Reflect.defineMetadata("current-user", parameters, target, propertyKey);
  };
};
