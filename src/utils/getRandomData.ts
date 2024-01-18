import { getRandomInt } from "./getRandomInt";

export const getRandomData = async <T>(url: string, id?: number) => {
  const randomId = id ?? getRandomInt(30);
  const data = await fetch(`${url}/${randomId}`);
  const json = (await data.json()) as T;
  return json;
};
