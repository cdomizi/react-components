/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { AxiosError } from "axios";

export const axiosErrorHandler = (error: AxiosError) => {
  return `${error.response?.status || "Error"}: ${
    error?.message || "Unexpected error"
  }`;
};
