import { UserType } from "../../types";
import {
  getProductsArray,
  getRandomData,
  getRandomInt,
} from "../getRandomData";

describe("getRandomInt", () => {
  test("return random integer between 1 and 10 with no arguments", () => {
    expect(getRandomInt()).toBeGreaterThanOrEqual(1);
    expect(getRandomInt()).toBeLessThanOrEqual(10);
  });

  test("return random integer between 1 and provided argument", () => {
    expect(getRandomInt()).toBeGreaterThanOrEqual(1);
    expect(getRandomInt(8)).toBeLessThanOrEqual(8);
  });

  test("return random integer between provided arguments", () => {
    expect(getRandomInt(12, 5)).toBeGreaterThanOrEqual(5);
    expect(getRandomInt(12, 5)).toBeLessThanOrEqual(12);
  });
});

describe("getRandomData", () => {
  test("returns object with expected properties", async () => {
    const randomUser = await getRandomData<UserType>(
      "https://dummyjson.com/users/",
    );

    expect(randomUser).toHaveProperty("username");
    expect(randomUser).toHaveProperty("email");
  });

  test("returns expected data if provided with second argument", async () => {
    const getUser = async () => {
      const response = await fetch("https://dummyjson.com/users/1");
      const data = (await response.json()) as Promise<UserType>;
      return data;
    };
    const expectedUser = await getUser();
    const user = await getRandomData<UserType>(
      "https://dummyjson.com/users/",
      1,
    );

    expect(user).toEqual(expectedUser);
  });

  describe("getProductsArray", () => {
    test("returns a array of length between 1 and 3", async () => {
      const products = await getProductsArray();

      expect(products.length).toBeGreaterThan(0);
      expect(products.length).toBeLessThanOrEqual(3);
    });

    test("array items to have the expected properties", async () => {
      const products = await getProductsArray();
      const randomProduct = products[0];

      expect(randomProduct).toHaveProperty("product");
      expect(randomProduct).toHaveProperty("quantity");
    });

    test("array items properties to be of the expected type", async () => {
      const products = await getProductsArray();
      const randomProduct = products[0];

      expect(randomProduct.product).toBeTypeOf("string");
      expect(randomProduct.quantity).toBeTypeOf("number");
    });
  });

  test("array does not contain duplicate products", async () => {
    const productsArray = await getProductsArray();
    const products = productsArray.map((product) => product.product);
    const uniqueProducts = new Set(products);
    console.log(uniqueProducts);

    expect(uniqueProducts.size).toBe(productsArray.length);
  });
});
