import { http, HttpResponse } from "msw";
import { allPosts, allProducts, allUsers, createProduct } from "./data";

export const handlers = [
  http.get("https://dummyjson.com/products", () =>
    HttpResponse.json(allProducts),
  ),
  http.get("https://dummyjson.com/product/:id", ({ params }) => {
    const { id } = params;

    const product = allProducts.find((product) => id === product.id.toString());

    return HttpResponse.json(product);
  }),
  http.get("https://dummyjson.com/users", () => HttpResponse.json(allUsers)),
  http.get("https://dummyjson.com/user/:id", ({ params }) => {
    const { id } = params;

    const user = allUsers.find((user) => id === user.id.toString());

    return HttpResponse.json(user);
  }),
  http.get("https://dummyjson.com/posts", () => HttpResponse.json(allPosts)),
  http.post("https://dummyjson.com/products/add", () =>
    HttpResponse.json(createProduct),
  ),
];
