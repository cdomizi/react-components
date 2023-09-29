import axios from "axios";

const axiosErrorHandler = (error: unknown) => {
  if (axios.isAxiosError<CustomError>(error))
    return `${error.response?.status ?? "Error"}: ${
      error.response?.data?.message ?? "Unexpected error"
    }`;
};

export default axiosErrorHandler;
