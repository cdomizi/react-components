import { AxiosResponse } from "axios";

const delayFunc = async (func: () => unknown, ms?: number) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(func()), ms ?? 2000);
  });

const delayRequest = async (value: Response | AxiosResponse) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(value), 2000);
  });

export { delayFunc, delayRequest };
