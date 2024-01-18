import { http, HttpResponse } from "msw";
import {
  allPosts,
  allProducts,
  allUsers,
  getProductResponseData,
} from "./data";

export const handlers = [
  http.get("https://dummyjson.com/product/1", () =>
    HttpResponse.json(getProductResponseData),
  ),
  http.get("https://dummyjson.com/products", () =>
    HttpResponse.json(allProducts),
  ),
  http.get("https://dummyjson.com/products/:id", ({ params }) => {
    const { id } = params;

    const product = allProducts.find((product) => id === product.id.toString());

    return HttpResponse.json(product);
  }),
  http.get("https://dummyjson.com/users", () => HttpResponse.json(allUsers)),
  http.get("https://dummyjson.com/users/:id", ({ params }) => {
    const { id } = params;

    const user = allUsers.find((user) => id === user.id.toString());

    return HttpResponse.json(user);
  }),
  http.get("https://dummyjson.com/posts", () => HttpResponse.json(allPosts)),
];
