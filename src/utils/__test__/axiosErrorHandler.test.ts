import axios, { AxiosError } from "axios";
import { describe, expect, test } from "vitest";
import { axiosErrorHandler } from "../axiosErrorHandler";

describe("axiosErrorHandler", () => {
  test("returns generic error message", () => {
    const expectedErrorMessage = "Error: Unexpected error";
    const err = new AxiosError();
    const errorMessage = axiosErrorHandler(err);

    expect(errorMessage).toMatch(expectedErrorMessage);
  });

  test("returns expected error message", async () => {
    const expectedErrorMessage = "404: Product with id '101' not found";
    let errorMessage;
    try {
      await axios.get("https://dummyjson.com/product/101");
    } catch (err) {
      errorMessage = axiosErrorHandler(err) ?? null;
    }

    expect(errorMessage).toMatch(expectedErrorMessage);
  });
});
