export type Result<T> =
  | { kind: "empty" }
  | {
      kind: "ok";
      data: T;
    }
  | {
      kind: "error";
      error: string;
    };

export const resultMap = <T, U>(
  result: Result<T>,
  fn: (data: T) => U,
): Result<U> => {
  if (result.kind === "ok") {
    return { kind: "ok", data: fn(result.data) };
  } else {
    return result;
  }
};

export const resultFlatMap = <T, U>(
  result: Result<T>,
  fn: (data: T) => Result<U>,
): Result<U> => {
  if (result.kind === "ok") {
    return fn(result.data);
  } else {
    return result;
  }
};

export const resultAsyncMap = async <T, U>(
  result: Result<T>,
  fn: (data: T) => Promise<U>,
): Promise<Result<U>> => {
  if (result.kind === "ok") {
    return { kind: "ok", data: await fn(result.data) };
  } else {
    return result;
  }
};

export const resultAsyncFlatMap = async <T, U>(
  result: Result<T>,
  fn: (data: T) => Promise<Result<U>>,
): Promise<Result<U>> => {
  if (result.kind === "ok") {
    return await fn(result.data);
  } else {
    return result;
  }
};

export const resultDefault = <T>(
  result: Result<T>,
  defaultValue: () => T,
): Result<T> => {
  if (result.kind === "ok") {
    return result;
  }
  return { kind: "ok", data: defaultValue() };
};

export const resultFlatDefault = <T>(
  result: Result<T>,
  defaultValue: () => Result<T>,
): Result<T> => {
  if (result.kind === "ok") {
    return result;
  }
  return defaultValue();
};

export const resultAsyncDefault = async <T>(
  result: Result<T>,
  defaultValue: () => Promise<T>,
): Promise<Result<T>> => {
  if (result.kind === "ok") {
    return result;
  }
  return { kind: "ok", data: await defaultValue() };
};

export const resultAsyncFlatDefault = async <T>(
  result: Result<T>,
  defaultValue: () => Promise<Result<T>>,
): Promise<Result<T>> => {
  if (result.kind === "ok") {
    return result;
  }
  return defaultValue();
};

export const resultUnwrap = <T>(result: Result<T>, defaultValue: T): T => {
  if (result.kind === "ok") {
    return result.data;
  } else {
    return defaultValue;
  }
};
