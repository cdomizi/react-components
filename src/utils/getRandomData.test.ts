import { describe, expect, test } from "vitest";
import { getRandomInt } from "./getRandomData";

describe("getRandomData", () => {
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
