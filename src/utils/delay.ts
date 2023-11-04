const delayFunc = async (func: () => unknown, ms?: number) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(func()), ms ?? 2000);
  });

const delayRequest = async <TData>(value: TData) =>
  new Promise<TData>((resolve) => {
    setTimeout(() => resolve(value), 2000);
  });

const delayAxiosRequest = async <TData>(
  value: TData | PromiseLike<TData>,
): Promise<TData> =>
  new Promise((resolve) => {
    setTimeout(() => resolve(value), 2000);
  });

export { delayFunc, delayRequest, delayAxiosRequest };
