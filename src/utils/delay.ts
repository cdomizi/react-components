const delayFunc = async (func: () => unknown, ms?: number) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(func()), ms ?? 2000);
  });

const delayRequest = async <TData>(value: TData, ms?: number) =>
  new Promise<TData>((resolve) => {
    setTimeout(() => resolve(value), ms ?? 2000);
  });

const delayAxiosRequest = async <TData>(
  value: TData | PromiseLike<TData>,
  ms?: number,
): Promise<TData> =>
  new Promise((resolve) => {
    setTimeout(() => resolve(value), ms ?? 2000);
  });

export { delayFunc, delayRequest, delayAxiosRequest };
