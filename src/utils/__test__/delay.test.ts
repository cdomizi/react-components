import { delayAxiosRequest, delayFunc, delayRequest } from "../delay";
import axios from "axios";

// Mocks
const func = vi.fn(() => "run");
const asyncFunc = Promise.resolve("run");

const productData = {
  id: 1,
  title: "iPhone 9",
  price: 549,
};
vi.mock("axios");
vi.mocked(axios, true).get.mockResolvedValueOnce({ data: productData });
const response = await axios.get("https://dummyjson.com/product/1");

describe("delay", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  test.only("fake timers", () => {
    func();

    expect(func).toHaveBeenCalledTimes(1);
  });

  test("function delayed 2000ms", async () => {
    await delayFunc(func);

    vi.advanceTimersByTime(1000);
    expect(func).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1000);
    expect(func).toHaveBeenCalledTimes(1);
  }, 2000);

  test("function delayed with specified timeout", async () => {
    await expect(delayFunc(func, 1000)).resolves.toBe("run");
  }, 1000);

  test("Promise delayed 2000ms", async () => {
    await expect(delayRequest(asyncFunc)).resolves.toBe("run");
  }, 2000);

  test("Promise delayed with specified timeout", async () => {
    await expect(delayRequest(asyncFunc, 1000)).resolves.toBe("run");
  }, 1000);

  test("Axios request delayed 2000ms", async () => {
    await expect(delayAxiosRequest(response)).resolves.toBe(response);
  }, 2010);

  test("Axios request delayed with specified timeout", async () => {
    await expect(delayAxiosRequest(response, 1500)).resolves.toBe(response);
  }, 1510);
});
