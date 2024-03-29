// Execute callback after specified time
const delayFunc = (callback: () => void, ms = 2000) => {
  setTimeout(callback, ms);
};

// Resolve Promise with callback result after specified time
const delayCallback = async (callback: () => void, ms = 2000) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(callback()), ms);
  });

// Resolve Promise with value after specified time
const delayRequest = async <TData>(value: TData, ms = 2000) =>
  new Promise<TData>((resolve) => {
    setTimeout(() => resolve(value), ms);
  });

// Delay Axios request with a specified timeout
const delayAxiosRequest = async <TData>(
  value: TData | PromiseLike<TData>,
  ms = 2000,
): Promise<TData> =>
  new Promise((resolve) => {
    setTimeout(() => resolve(value), ms);
  });

export { delayAxiosRequest, delayCallback, delayFunc, delayRequest };
