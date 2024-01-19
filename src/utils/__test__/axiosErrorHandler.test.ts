import { AxiosError, AxiosHeaders, AxiosResponse } from "axios";
import { axiosErrorHandler } from "../axiosErrorHandler";

export const notFoundErrorResponse: AxiosResponse = {
  data: "not found!",
  status: 404,
  statusText: "",
  config: {
    headers: new AxiosHeaders(),
  },
  headers: {},
};

export const notFoundError: AxiosError = {
  isAxiosError: true,
  config: { headers: new AxiosHeaders() },
  toJSON: () => ({}),
  name: "",
  message: "404: Product with id '101' not found",
  response: notFoundErrorResponse,
};

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
    const errorMessage = axiosErrorHandler(notFoundError) ?? null;
    const expectedErrorMessage = "404: Product with id '101' not found";

    expect(errorMessage).toMatch(expectedErrorMessage);
  });
});
