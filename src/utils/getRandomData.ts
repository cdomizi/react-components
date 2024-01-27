import { getRandomInt } from "./getRandomInt";

export const getRandomData = async <T>(url: string, id?: number) => {
  const randomId = id ?? getRandomInt(30);
  const response = await fetch(`${url}/${randomId}`);
  const data = (await response.json()) as T;
  return data;
};
