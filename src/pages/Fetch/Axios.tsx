import { useCallback, useMemo, useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";

import { Product, ProductQuery } from "../../types";

import { axiosErrorHandler } from "../../utils/axiosErrorHandler";
import { delayAxiosRequest } from "../../utils/delay";
import { Logger } from "../../components/Logger";

import { Box, Button, Typography } from "@mui/material";

export const Axios = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ProductQuery | null>(null);

  const getProduct = useCallback(async () => {
    setIsLoading(true);

    try {
      const response: AxiosResponse<Product> = await axios.get(
        "https://dummyjson.com/product/1",
      );
      // Artificially delay response to show loading state
      const delayedResponse = await delayAxiosRequest(response);
      const { id, title, brand, price } = delayedResponse.data ?? null;
      setData({
        method: delayedResponse.config.method?.toUpperCase(),
        data: {
          id,
          title,
          brand,
          price,
        },
      });
    } catch (err) {
      const axiosError =
        err instanceof AxiosError ? axiosErrorHandler(err) : null;
      setError(axiosError);
      console.error(err);
    }

    setIsLoading(false);
  }, []);

  // New sample product
  const newProduct: Product = useMemo(
    () => ({
      title: "Ethernet Cable",
      brand: "genTech",
      price: 12,
    }),
    [],
  );

  const addProduct = useCallback(async () => {
    setIsLoading(true);

    try {
      const response: AxiosResponse<Product> = await axios.post(
        "https://dummyjson.com/product/add",
        newProduct,
      );
      // Artificially delay response to show loading state
      const delayedResponse = await delayAxiosRequest(response);
      const { id, title, brand, price } = delayedResponse.data ?? null;
      setData({
        method: delayedResponse.config.method?.toUpperCase(),
        data: {
          id,
          title,
          brand,
          price,
        },
      });
    } catch (err) {
      const axiosError =
        err instanceof AxiosError ? axiosErrorHandler(err) : null;
      setError(axiosError);
      console.error(err);
    }

    setIsLoading(false);
  }, [newProduct]);

  return (
    <Box>
      <Typography variant="h4" paragraph>
        Axios
      </Typography>
      <Button onClick={getProduct} variant="outlined" size="small">
        Get product
      </Button>
      <Button onClick={addProduct} variant="outlined" size="small">
        Add product
      </Button>
      {/* Show response data/error or loading */}
      <Logger
        value={((isLoading && "loading...") || (data ?? error)) ?? null}
      />
    </Box>
  );
};
