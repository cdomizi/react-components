import { http, HttpResponse } from "msw";
import {
  allPosts,
  allProducts,
  allUsers,
  newPost,
  newProduct,
  randomPost,
} from "./data";

const API_ENDPOINT = import.meta.env.VITE_REACT_APP_BASE_API_URL;
const BASE_MOCK_API_URL = "https://dummyjson.com";

export const handlers = [
  /* === PRODUCTS === */
  // GET all products
  http.get(`${BASE_MOCK_API_URL}/products`, () =>
    HttpResponse.json(allProducts),
  ),
  // GET product by Id
  http.get(`${BASE_MOCK_API_URL}/product/:id`, ({ params }) => {
    const { id } = params;

    const product = allProducts.find((product) => id === product.id.toString());

    return HttpResponse.json(product);
  }),
  // POST new product
  http.post(`${BASE_MOCK_API_URL}/products/add`, () =>
    HttpResponse.json(newProduct),
  ),
  /* === USERS === */
  // GET all users
  http.get(`${BASE_MOCK_API_URL}/users`, () =>
    HttpResponse.json({ users: allUsers }),
  ),
  // GET user by Id
  http.get(`${BASE_MOCK_API_URL}/users/:id`, ({ params }) => {
    const { id } = params;

    const user = allUsers.find((user) => id === user.id.toString());

    return HttpResponse.json(user);
  }),
  /* === POSTS === */
  // GET all posts
  http.get(`${BASE_MOCK_API_URL}/posts`, () => HttpResponse.json(allPosts)),
  http.get(`${API_ENDPOINT}posts`, () => HttpResponse.json(allPosts)),
  // GET post by Id
  http.get(`${API_ENDPOINT}:id`, ({ params }) => {
    const { id } = params;

    const post = allPosts.find((post) => id === post.id.toString());

    return HttpResponse.json(post);
  }),
  // GET random post by Id
  http.get(`${BASE_MOCK_API_URL}/posts/:id`, () =>
    HttpResponse.json(randomPost),
  ),
  // POST new post
  http.post(`${API_ENDPOINT}posts`, () => HttpResponse.json(newPost)),
  // PUT post by Id
  http.put(`${API_ENDPOINT}posts/:id`, () => HttpResponse.json(randomPost)),
  // DELETE post by Id
  http.delete(`${API_ENDPOINT}posts/:id`, ({ params }) => {
    const { id } = params;

    const post = allPosts.find((post) => id === post.id.toString());

    return HttpResponse.json(post);
  }),
  /* ERRORS */
  // GET error
  http.get(`${BASE_MOCK_API_URL}/NOT_FOUND`, () =>
    HttpResponse.json({ error: "Not Found" }, { status: 404 }),
  ),
  // POST error
  http.post(`${BASE_MOCK_API_URL}/products/add/NOT_FOUND`, () =>
    HttpResponse.json({ error: "Not Found" }, { status: 404 }),
  ),
];
