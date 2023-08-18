/**
 * Cache output of getter
 * @param value
 * @param context
 * @returns
 */
export function cacheGetter<This, Return>(
  value: (this: This) => Return,
  context: ClassGetterDecoratorContext,
): (this: This) => Return {
  if (context.kind !== "getter") {
    return value;
  }

  return function (this: This) {
    const returnValue = value.call(this);
    Object.defineProperty(this, context.name, {
      value: returnValue,
      writable: false,
    });
    return returnValue;
  };
}
