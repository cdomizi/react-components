import { useCallback, useMemo, useState } from "react";

import { Product, ProductQuery } from "types";

import { Logger } from "components/Logger";
import { delayRequest } from "utils/delay";

import { Box, Button, Stack, Typography } from "@mui/material";

export const SimpleFetch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ProductQuery | null>(null);

  const handleError = useCallback((err: unknown) => {
    if (err instanceof Error)
      setError(
        `${err?.name || "Error"}: ${err?.message || "Unexpected error"}`,
      );
    console.error(err);
  }, []);

  const getProduct = useCallback(
    async (url?: string) => {
      setIsLoading(true);
      setData(null);
      setError(null);

      try {
        const response = await fetch(url || "https://dummyjson.com/products/1");
        // Artificially delay response to show loading state
        const delayedResponse = await delayRequest(response);
        const { id, title, price, brand } =
          (await delayedResponse.json()) as Product;
        setData({ method: "GET", data: { id, title, price, brand } });
      } catch (err) {
        if (err instanceof Error) handleError(err);
      }

      setIsLoading(false);
    },
    [handleError],
  );

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
        const response = await fetch(
          url || "https://dummyjson.com/products/add",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newProduct),
          },
        );
        // Artificially delay function to show loading state
        const delayedResponse = await delayRequest(response);
        const { id, title, price, brand } =
          (await delayedResponse.json()) as Product;
        setData({ method: "POST", data: { id, title, price, brand } });
      } catch (err) {
        handleError(err);
      }

      setIsLoading(false);
    },
    [handleError, newProduct],
  );

  return (
    <Box>
      <Typography variant="h4" paragraph>
        Simple Fetch
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
