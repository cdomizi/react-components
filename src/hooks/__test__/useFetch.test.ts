import { renderHook, waitFor } from "@testing-library/react";
import { useFetch } from "hooks/useFetch";
import { allUsers } from "mocks/data";

const API_ENDPOINT = import.meta.env.VITE_REACT_APP_BASE_API_URL;

describe("useFetch", () => {
  test("no URL provided", () => {
    const { loading, error, data } = renderHook(() => useFetch()).result
      .current;

    expect(loading).toBe(false);
    expect(error).toBeUndefined();
    expect(data).toBeUndefined();
  });

  test("loading state", async () => {
    const { result } = renderHook(() => useFetch(API_ENDPOINT));

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeUndefined();
    expect(result.current.data).toBeUndefined();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  test("error on failed fetching data", async () => {
    const NOT_FOUND_ENDPOINT = "https://dummyjson.com/NOT_FOUND";

    const { result } = renderHook(() => useFetch(NOT_FOUND_ENDPOINT));

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeUndefined();
    expect(result.current.data).toBeUndefined();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeDefined();
      expect(result.current.error?.message).toBe("Not Found");
    });
  });

  test("data fetched and stored in the cache", async () => {
    const userId = "1";
    const USER_ENDPOINT = `https://dummyjson.com/users/${userId}`;
    const expectedUser = allUsers.find((user) => user.id.toString() === userId);

    const { result } = renderHook(() => useFetch(USER_ENDPOINT));

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeUndefined();
    expect(result.current.data).toBeUndefined();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeUndefined();
      expect(result.current.data).toStrictEqual(expectedUser);
    });
  });
});
