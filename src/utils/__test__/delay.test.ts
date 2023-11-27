import { delayAxiosRequest, delayFunc, delayRequest } from "../delay";
import axios from "axios";

const productData = {
  id: 1,
  title: "iPhone 9",
  description: "An apple mobile which is nothing like apple",
  price: 549,
  discountPercentage: 12.96,
  rating: 4.69,
  stock: 94,
  brand: "Apple",
  category: "smartphones",
  thumbnail: "https://i.dummyjson.com/data/products/1/thumbnail.jpg",
  images: [
    "https://i.dummyjson.com/data/products/1/1.jpg",
    "https://i.dummyjson.com/data/products/1/2.jpg",
    "https://i.dummyjson.com/data/products/1/3.jpg",
    "https://i.dummyjson.com/data/products/1/4.jpg",
    "https://i.dummyjson.com/data/products/1/thumbnail.jpg",
  ],
};

vi.mock("axios");
vi.mocked(axios, true).get.mockResolvedValueOnce({ data: productData });

describe("delay", () => {
  test("function delayed 2000ms", async () => {
    const greet = () => "Hello!";

    await expect(delayFunc(greet)).resolves.toBe("Hello!");
  }, 2000);

  test("function delayed with specified timeout", async () => {
    const greet = () => "Hello!";

    await expect(delayFunc(greet, 1000)).resolves.toBe("Hello!");
  }, 1000);

  test("Promise delayed 2000ms", async () => {
    const asyncGreet = Promise.resolve("Hello!");

    await expect(delayRequest(asyncGreet)).resolves.toBe("Hello!");
  }, 2000);

  test("Promise delayed with specified timeout", async () => {
    const asyncGreet = Promise.resolve("Hello!");

    await expect(delayRequest(asyncGreet, 1000)).resolves.toBe("Hello!");
  }, 1000);

  test("Axios request delayed 2000ms", async () => {
    const response = await axios.get("https://dummyjson.com/product/1");

    await expect(delayAxiosRequest(response)).resolves.toBe(response);
  }, 2010);

  test("Axios request delayed with specified timeout", async () => {
    const response = await axios.get("https://dummyjson.com/product/1");

    await expect(delayAxiosRequest(response, 1500)).resolves.toBe(response);
  }, 1510);
});
