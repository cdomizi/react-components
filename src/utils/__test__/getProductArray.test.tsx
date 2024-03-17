import * as getProductArray from "utils/getProductArray";
import * as getRandomInt from "utils/getRandomInt";

describe("getProductsArray", () => {
  test("returns an array length within specified range", async () => {
    const randomProducts = await getProductArray.getProductArray();

    expect(Array.isArray(randomProducts)).toBe(true);
    expect(randomProducts.length).toBeGreaterThan(0);
    expect(randomProducts.length).toBeLessThanOrEqual(3);
  });

  test("returns an array of products", async () => {
    const randomProducts = await getProductArray.getProductArray();

    randomProducts.forEach((product) => {
      expect(product).toHaveProperty("product");
      expect(product.product).toBeTruthy();
      expect(product).toHaveProperty("quantity");
      expect(Number.isInteger(product.quantity)).toBe(true);
      expect(product.quantity).toBeGreaterThan(0);
      expect(product.quantity).lessThanOrEqual(3);
    });
  });

  test("returns an array with no duplicate items", async () => {
    // Mock array containing duplicate item
    const mockProductArray = [{ "1": 2 }, { "1": 1 }, { "2": 3 }];

    vi.spyOn(getRandomInt, "getRandomInt")
      .mockReturnValueOnce(mockProductArray.length) // Product count
      .mockReturnValueOnce(parseInt(Object.keys(mockProductArray[0])[0])) // ID of product #1
      .mockReturnValueOnce(mockProductArray[0]["1"]!) // Quantity of product #1
      .mockReturnValueOnce(parseInt(Object.keys(mockProductArray[1])[0])) // ID of product #2
      .mockReturnValueOnce(mockProductArray[1]["1"]!) // Quantity of product #2
      .mockReturnValueOnce(parseInt(Object.keys(mockProductArray[2])[0])) // ID of product #3
      .mockReturnValueOnce(mockProductArray[2]["2"]!); // Quantity of product #2

    const randomProducts = await getProductArray.getProductArray();
    const products = randomProducts.map((product) => product.product);
    const uniqueProducts = new Set(products);

    // The final array only contains unique products
    expect(uniqueProducts.size).toBe(randomProducts.length);
  });
});
