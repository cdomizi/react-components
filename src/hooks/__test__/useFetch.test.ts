import { renderHook, waitFor } from "@testing-library/react";
import { useFetch } from "hooks/useFetch";

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
    const { loading, error, data } = renderHook(() => useFetch(API_ENDPOINT))
      .result.current;

    expect(loading).toBe(true);
    expect(error).toBeUndefined();
    expect(data).toBeUndefined();

    await waitFor(() => {
      expect(loading).toBe(false);
    });
  });
});
