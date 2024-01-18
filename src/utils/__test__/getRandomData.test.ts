import { allProducts, allUsers } from "mocks/data";
import { UserType } from "types";
import * as getProductsArray from "utils/getProductsArray";
import * as getRandomData from "utils/getRandomData";
import * as getRandomInt from "utils/getRandomInt";

describe("getRandomInt", () => {
  test("return random integer between 1 and 10 with no arguments", () => {
    expect(getRandomInt.getRandomInt()).toBeGreaterThanOrEqual(1);
    expect(getRandomInt.getRandomInt()).toBeLessThanOrEqual(10);
  });

  test("return random integer between 1 and provided argument", () => {
    expect(getRandomInt.getRandomInt()).toBeGreaterThanOrEqual(1);
    expect(getRandomInt.getRandomInt(8)).toBeLessThanOrEqual(8);
  });

  test("return random integer in the provided range", () => {
    expect(getRandomInt.getRandomInt(12, 5)).toBeGreaterThanOrEqual(5);
    expect(getRandomInt.getRandomInt(12, 5)).toBeLessThanOrEqual(12);
  });
});

describe("getRandomData", () => {
  const expectedRandomUser = allUsers[0];

  test("returns object with expected properties", async () => {
    vi.spyOn(getRandomInt, "getRandomInt").mockReturnValue(1);

    const randomUser = await getRandomData.getRandomData<UserType>(
      "https://dummyjson.com/users",
    );

    expect(randomUser).toStrictEqual(expectedRandomUser);
  });

  test("returns expected data if provided with second argument", async () => {
    const user = await getRandomData.getRandomData<UserType>(
      "https://dummyjson.com/users",
      expectedRandomUser.id,
    );

    expect(user).toStrictEqual(expectedRandomUser);
  });

  describe("getProductsArray", () => {
    test("returns an array of length between 1 and 3", async () => {
      const products = await getProductsArray.getProductsArray();

      expect(products.length).toBeGreaterThan(0);
      expect(products.length).toBeLessThanOrEqual(3);
    });

    test("array contains random products", async () => {
      const expectedProductsArray = [allProducts[0], allProducts[1]];

      vi.spyOn(getRandomInt, "getRandomInt")
        .mockReturnValueOnce(expectedProductsArray.length)
        .mockReturnValueOnce(expectedProductsArray[0].id)
        .mockReturnValueOnce(expectedProductsArray[1].id);

      const randomProducts = await getProductsArray.getProductsArray();

      randomProducts.forEach((item, index) => {
        expect(item.product).toEqual(expectedProductsArray[index].title);
      });
    });

    test("array does not contain duplicate products", async () => {
      // Provided mock array contains the same element twice
      const expectedProductsArray = [
        allProducts[0],
        allProducts[1],
        allProducts[1],
      ];

      vi.spyOn(getRandomInt, "getRandomInt")
        .mockReturnValueOnce(expectedProductsArray.length)
        .mockReturnValueOnce(expectedProductsArray[0].id)
        .mockReturnValueOnce(expectedProductsArray[1].id)
        .mockReturnValueOnce(expectedProductsArray[2].id);

      const productsArray = await getProductsArray.getProductsArray();
      const products = productsArray.map((product) => product.product);
      const uniqueProducts = new Set(products);

      // The final array only contains unique products
      expect(uniqueProducts.size).toBe(productsArray.length);
    });
  });
});
