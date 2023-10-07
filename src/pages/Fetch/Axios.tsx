import { useCallback, useState } from "react";
import axios, { AxiosResponse } from "axios";

// Project import
import axiosErrorHandler from "../../utils/axiosErrorHandler";
import { delayAxiosRequest } from "../../utils/delay";
import Logger from "../../components/Logger";

// MUI components
import { Box, Button, Typography } from "@mui/material";

type Product = {
  id: number;
  title: string;
  price: number;
  brand: string;
};

type ProductData = {
  method?: "GET" | "POST";
  data: Product;
};

const Axios = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ProductData | null>(null);

  const getProduct = useCallback(async () => {
    setIsLoading(true);

    try {
      const response: AxiosResponse<Product> = await axios.get(
        "https://dummyjson.com/product/1",
      );
      const delayedResponse = await delayAxiosRequest(response);
      const { id, title, brand, price } = delayedResponse.data ?? null;
      setData({
        method: "GET",
        data: {
          id,
          title,
          brand,
          price,
        },
      });
    } catch (err) {
      const axiosError = axiosErrorHandler(err) ?? null;
      setError(axiosError);
      console.error(err);
    }

    setIsLoading(false);
  }, []);

  const addProduct = useCallback(async () => {
    setIsLoading(true);

    try {
      const response: AxiosResponse<Product> = await axios.post(
        "https://dummyjson.com/product/add",
        {
          title: "Ethernet Cable",
          price: "12",
          brand: "genTech",
        },
      );
      const delayedResponse = await delayAxiosRequest(response);
      const { id, title, brand, price } = delayedResponse.data ?? null;
      setData({
        method: "GET",
        data: {
          id,
          title,
          brand,
          price,
        },
      });
    } catch (err) {
      const axiosError = axiosErrorHandler(err) ?? null;
      setError(axiosError);
      console.error(err);
    }

    setIsLoading(false);
  }, []);

  return (
    <Box>
      <Typography variant="h4" paragraph>
        Axios
      </Typography>
      <Button onClick={() => void getProduct()} variant="outlined" size="small">
        Get product
      </Button>
      <Button onClick={() => void addProduct()} variant="outlined" size="small">
        Add product
      </Button>
      <Logger
        value={((isLoading && "loading...") || (data ?? error)) ?? null}
      />
    </Box>
  );
};

export default Axios;
