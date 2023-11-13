import { describe, expect, test } from "vitest";
import { delayAxiosRequest, delayFunc, delayRequest } from "../delay";
import axios from "axios";

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
  });

  test.only("Axios request delayed with specified timeout", async () => {
    const response = await axios.get("https://dummyjson.com/product/1");

    await expect(delayAxiosRequest(response, 1500)).resolves.toBe(response);
  });
});
