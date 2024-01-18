import axios, { AxiosError, AxiosResponse } from "axios";
import { useCallback, useMemo, useState } from "react";

import { Product, ProductQuery } from "types";

import { Logger } from "components/Logger";
import { axiosErrorHandler } from "utils/axiosErrorHandler";
import { delayAxiosRequest } from "utils/delay";

import { Box, Button, Stack, Typography } from "@mui/material";

export const Axios = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ProductQuery | null>(null);

  const getProduct = useCallback(async (url?: string) => {
    setIsLoading(true);
    setData(null);
    setError(null);

    try {
      const response: AxiosResponse<Product> = await axios.get(
        url || "https://dummyjson.com/product/1",
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

  const addProduct = useCallback(
    async (url?: string) => {
      setIsLoading(true);
      setData(null);
      setError(null);

      try {
        const response: AxiosResponse<Product> = await axios.post(
          url || "https://dummyjson.com/product/add",
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
    },
    [newProduct],
  );

  return (
    <Box>
      <Typography variant="h4" paragraph>
        Axios
      </Typography>
      <Stack direction="row" mt={1} gap={1}>
        <Button onClick={() => getProduct()} variant="outlined" size="small">
          Get product
        </Button>
        <Button onClick={() => addProduct()} variant="outlined" size="small">
          Add product
        </Button>
      </Stack>
      <Stack direction="row" mt={1} gap={1}>
        <Button
          // Provide wrong URL to produce an error
          onClick={() => getProduct("https://dummyjson.com/NOT_FOUND")}
          variant="outlined"
          size="small"
          color="error"
        >
          Get product error
        </Button>
        <Button
          // Provide wrong URL to produce an error
          onClick={() =>
            addProduct("https://dummyjson.com/products/add/NOT_FOUND")
          }
          variant="outlined"
          size="small"
          color="error"
        >
          Add product error
        </Button>
      </Stack>
      {/* Show response data/error or loading */}
      <Logger
        value={((isLoading && "loading...") || (data ?? error)) ?? null}
      />
    </Box>
  );
};
