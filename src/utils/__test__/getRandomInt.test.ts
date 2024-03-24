import { getRandomInt } from "utils/getRandomInt";

describe("getRandomInt", () => {
  test("returns an integer", () => {
    const result = getRandomInt(10, 5);
    expect(Number.isInteger(result)).toBe(true);
  });

  test("returns a number within the default range if no arguments are provided", () => {
    const result = getRandomInt();
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(10);
  });

  test("returns a number within the specified range", () => {
    const result = getRandomInt(10, 5);
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(10);
  });
});
