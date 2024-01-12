import { http, HttpResponse } from "msw";
import { getResponseData } from "./data";

export const handlers = [
  http.get("https://dummyjson.com/product/1", () =>
    HttpResponse.json(getResponseData),
  ),
];
