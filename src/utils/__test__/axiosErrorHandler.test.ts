import { AxiosError, AxiosHeaders, AxiosResponse } from "axios";
import { describe, expect, test } from "vitest";
import { axiosErrorHandler } from "../axiosErrorHandler";

describe("axiosErrorHandler", () => {
  test("returns generic error message", () => {
    const genericErrorResponse: AxiosResponse = {
      data: {},
      status: NaN,
      statusText: "",
      config: {
        headers: new AxiosHeaders(),
      },
      headers: {},
    };
    const genericError: AxiosError = {
      isAxiosError: true,
      config: { headers: new AxiosHeaders() },
      toJSON: () => ({}),
      name: "",
      message: "",
      response: genericErrorResponse,
    };
    const errorMessage = axiosErrorHandler(genericError);
    const expectedErrorMessage = "Error: Unexpected error";

    expect(errorMessage).toMatch(expectedErrorMessage);
  });

  test("returns expected error message", () => {
    const specificErrorResponse: AxiosResponse = {
      data: {},
      status: 404,
      statusText: "Not Found",
      config: {
        headers: new AxiosHeaders(),
      },
      headers: {},
    };
    const specificError: AxiosError = {
      isAxiosError: true,
      config: { headers: new AxiosHeaders() },
      toJSON: () => ({}),
      name: "",
      message: "404: Product with id '101' not found",
      response: specificErrorResponse,
    };
    const errorMessage = axiosErrorHandler(specificError) ?? null;
    const expectedErrorMessage = "404: Product with id '101' not found";

    expect(errorMessage).toMatch(expectedErrorMessage);
  });
});
