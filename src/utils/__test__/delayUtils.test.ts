import axios from "axios";
import {
  delayAxiosRequest,
  delayCallback,
  delayFunc,
  delayRequest,
} from "../delayUtils";

// Mocks
const testData = { data: "test" };

describe("delay helper functions", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  test("executes callback after specified time", () => {
    const mockCallback = vi.fn();

    delayFunc(mockCallback, 1000);

    expect(mockCallback).not.toHaveBeenCalled();

    vi.runAllTimers();

    expect(mockCallback).toHaveBeenCalledOnce();
  });

  test("resolves Promise with value after specified time", async () => {
    // const delayedData = delayRequest(true, 1000).then((resolved) => {
    //   expect(resolved).toBe(true);
    // });
    // vi.runAllTimers();
    // return delayedData;
    const result = delayRequest(testData, 1000);

    vi.runAllTimers();

    await expect(result).resolves.toBe(testData);
  });

  test("resolves Promise with callback result after specified time", async () => {
    const mockCallback = vi.fn(() => testData);

    const delayedResult = delayCallback(mockCallback, 1000);

    expect(mockCallback).not.toHaveBeenCalled();

    vi.runAllTimers();

    await expect(delayedResult).resolves.toBe(testData);
    expect(mockCallback).toHaveBeenCalledOnce();
  });

  test("delayed Axios request with specified timeout", async () => {
    const axiosSpy = vi.spyOn(axios, "get").mockResolvedValue(testData);

    const delayedData = delayAxiosRequest(
      axios.get("https://example.com"),
      1000,
    );

    vi.runAllTimers();

    expect(axiosSpy).toHaveBeenCalledOnce();
    await expect(delayedData).resolves.toBe(testData);
  });
});
