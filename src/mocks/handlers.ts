import { http, HttpResponse } from "msw";
import { allPosts, allProducts, allUsers, newPost, newProduct } from "./data";

const API_ENDPOINT = import.meta.env.VITE_REACT_APP_BASE_API_URL;
const PRODUCTS_MOCK_API_ENDPOINT = "https://dummyjson.com/products";
const USERS_MOCK_API_ENDPOINT = "https://dummyjson.com/users";
const POSTS_MOCK_API_ENDPOINT = "https://dummyjson.com/posts";

export const handlers = [
  /* === PRODUCTS === */
  // GET all products
  http.get(PRODUCTS_MOCK_API_ENDPOINT, () => HttpResponse.json(allProducts)),
  // GET product by Id
  http.get(`${PRODUCTS_MOCK_API_ENDPOINT}/:id`, ({ params }) => {
    const { id } = params;

    const product = allProducts.find((product) => id === product.id.toString());

    return HttpResponse.json(product);
  }),
  // POST new product
  http.post(`${PRODUCTS_MOCK_API_ENDPOINT}/add`, () =>
    HttpResponse.json(newProduct),
  ),
  /* === USERS === */
  // GET all users
  http.get(USERS_MOCK_API_ENDPOINT, () =>
    HttpResponse.json({ users: allUsers }),
  ),
  // GET user by Id
  http.get(`${USERS_MOCK_API_ENDPOINT}/:id`, ({ params }) => {
    const { id } = params;

    const user = allUsers.find((user) => id === user.id.toString());

    return HttpResponse.json(user);
  }),
  /* === POSTS === */
  // GET all posts
  http.get(`${POSTS_MOCK_API_ENDPOINT}`, () => HttpResponse.json(allPosts)),
  http.get(API_ENDPOINT, () => HttpResponse.json(allPosts)),
  // GET post by Id
  http.get(`${POSTS_MOCK_API_ENDPOINT}/:id`, ({ params }) => {
    const { id } = params;

    const post = allPosts.find((post) => id === post.id.toString());

    return HttpResponse.json(post);
  }),
  http.get(`${API_ENDPOINT}/:id`, ({ params }) => {
    const { id } = params;

    const post = allPosts.find((post) => id === post.id.toString());

    return HttpResponse.json(post);
  }),
  // POST new post
  http.post(API_ENDPOINT, () => HttpResponse.json(newPost)),
  // PUT post by Id
  http.put(`${API_ENDPOINT}/:id`, ({ params }) => {
    const { id } = params;

    const post = allPosts.find((post) => id === post.id.toString());

    return HttpResponse.json(post);
  }),
  // DELETE post by Id
  http.delete(`${API_ENDPOINT}/:id`, ({ params }) => {
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
