import axios from "axios";

export type CustomError = {
  message?: string | undefined;
};

export const axiosErrorHandler = (error: unknown) => {
  if (axios.isAxiosError<CustomError>(error))
    return `${error.response?.status ?? "Error"}: ${
      error.response?.data?.message ?? "Unexpected error"
    }`;
};
