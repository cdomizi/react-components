import axios, { AxiosHeaders, AxiosResponse } from "axios";
import {
  delayAxiosRequest,
  delayCallback,
  delayFunc,
  delayRequest,
} from "../delay";

// Mocks
const func = vi.fn();
const users = [{ name: "John Doe" }];
vi.mock("axios");
vi.mocked(axios, true).get.mockResolvedValue({ data: users });
const response: AxiosResponse = {
  data: users,
  status: 200,
  statusText: "OK",
  headers: new AxiosHeaders(),
  config: { headers: new AxiosHeaders() },
};

describe("delay helper functions", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  test("delayed function execution", () => {
    delayFunc(func, 1000);

    expect(func).not.toHaveBeenCalled();

    vi.runAllTimers();
    expect(func).toHaveBeenCalledOnce();
  });

  test("delayed Promise resolution", async () => {
    // const delayedData = delayRequest(true, 1000).then((resolved) => {
    //   expect(resolved).toBe(true);
    // });
    // vi.runAllTimers();
    // return delayedData;

    const delayedData = delayRequest(true, 1000);
    vi.runAllTimers();
    await expect(delayedData).resolves.toBe(true);
  });

  test("delayed function execution within a Promise", async () => {
    const delayedResult = delayCallback(func);
    expect(func).not.toHaveBeenCalled();

    vi.runAllTimers();
    await expect(delayedResult).resolves.toBeUndefined();
    expect(func).toHaveBeenCalledOnce();
  });

  test("delayed Axios request with specified timeout", async () => {
    const delayedData = delayAxiosRequest(response, 1000);
    vi.runAllTimers();
    await expect(delayedData).resolves.toBe(response);
  });
});
