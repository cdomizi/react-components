import { http, HttpResponse } from "msw";
import { allPosts, allProducts, allUsers, newProduct } from "./data";

export const handlers = [
  /* === PRODUCTS === */
  // GET all products
  http.get("https://dummyjson.com/products", () =>
    HttpResponse.json(allProducts),
  ),
  // GET product by Id
  http.get("https://dummyjson.com/product/:id", ({ params }) => {
    const { id } = params;

    const product = allProducts.find((product) => id === product.id.toString());

    return HttpResponse.json(product);
  }),
  // POST new product
  http.post("https://dummyjson.com/products/add", () =>
    HttpResponse.json(newProduct),
  ),
  /* === USERS === */
  // GET all users
  http.get("https://dummyjson.com/users", () => HttpResponse.json(allUsers)),
  // GET user by Id
  http.get("https://dummyjson.com/user/:id", ({ params }) => {
    const { id } = params;

    const user = allUsers.find((user) => id === user.id.toString());

    return HttpResponse.json(user);
  }),
  /* === POSTS === */
  // GET all posts
  http.get("https://dummyjson.com/posts", () => HttpResponse.json(allPosts)),
  // GET post by Id
  http.get("https://dummyjson.com/posts/:id", ({ params }) => {
    const { id } = params;

    const post = allPosts.find((post) => id === post.id.toString());

    return HttpResponse.json(post);
  }),
  /* ERRORS */
  // GET error
  http.get("https://dummyjson.com/NOT_FOUND", () =>
    HttpResponse.json({ error: "Not found" }, { status: 404 }),
  ),
  // POST error
  http.post("https://dummyjson.com/products/add/NOT_FOUND", () =>
    HttpResponse.json({ error: "Not found" }, { status: 404 }),
  ),
];
