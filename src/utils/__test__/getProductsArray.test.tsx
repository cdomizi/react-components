import { allProducts } from "mocks/data";
import * as getProductsArray from "utils/getProductsArray";
import * as getRandomInt from "utils/getRandomInt";

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
