// Execute a function after a specified time
const delayFunc = (callback: () => void, ms = 2000) => {
  setTimeout(callback, ms);
};

// Execute a function wrapped in a Promise after a specified time
const delayCallback = async (callback: () => void, ms = 2000) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(callback()), ms);
  });

// Resolve a Promise after a specified time
const delayRequest = async <TData>(value: TData, ms = 2000) =>
  new Promise<TData>((resolve) => {
    setTimeout(() => resolve(value), ms);
  });

// Delay an Axios request with a specified timeout
const delayAxiosRequest = async <TData>(
  value: TData | PromiseLike<TData>,
  ms = 2000,
): Promise<TData> =>
  new Promise((resolve) => {
    setTimeout(() => resolve(value), ms);
  });

export { delayCallback, delayFunc, delayRequest, delayAxiosRequest };
