import { AxiosError, AxiosHeaders, AxiosResponse } from "axios";
import { axiosErrorHandler } from "../axiosErrorHandler";

export const notFoundMockResponse: AxiosResponse = {
  data: null,
  status: 404,
  statusText: "Not Found",
  config: {
    headers: new AxiosHeaders(),
  },
  headers: {},
};

export const notFoundMockError: AxiosError = {
  isAxiosError: true,
  config: { headers: new AxiosHeaders() },
  toJSON: () => ({}),
  name: "",
  message: "404: Product with id '101' not found",
  response: notFoundMockResponse,
};

describe("axiosErrorHandler", () => {
  test("returns generic error message", () => {
    const genericMockResponse: AxiosResponse = {
      data: {},
      status: NaN,
      statusText: "",
      config: {
        headers: new AxiosHeaders(),
      },
      headers: {},
    };
    const genericMockError: AxiosError = {
      isAxiosError: true,
      config: { headers: new AxiosHeaders() },
      toJSON: () => ({}),
      name: "",
      message: "",
      response: genericMockResponse,
    };

    const errorMessage = axiosErrorHandler(genericMockError);
    const expectedErrorMessage = "Error: Unexpected error";

    expect(errorMessage).toMatch(expectedErrorMessage);
  });

  test("returns expected error message", () => {
    const errorMessage = axiosErrorHandler(notFoundMockError) ?? null;
    const expectedErrorMessage = "404: Product with id '101' not found";

    expect(errorMessage).toMatch(expectedErrorMessage);
  });
});
