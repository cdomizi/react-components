import { useCallback, useMemo, useState } from "react";

import { Product, ProductQuery } from "../../types";

import { delayRequest } from "../../utils/delay";
import Logger from "../../components/Logger";

import { Box, Button, Typography } from "@mui/material";

const SimpleFetch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ProductQuery | null>(null);

  const getProduct = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await fetch("https://dummyjson.com/product/1");
      // Artificially delay function to show loading state
      const delayedResponse = await delayRequest(response);
      const { id, title, price, brand } =
        (await delayedResponse.json()) as Product;
      setData({ method: "GET", data: { id, title, price, brand } });
    } catch (err) {
      if (err instanceof Error)
        setError(
          `${err?.name || "Error"}: ${err?.message || "Unexpected error"}`,
        );
      console.error(err);
    }

    setIsLoading(false);
  }, []);

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
      const response = await fetch("https://dummyjson.com/products/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
      // Artificially delay function to show loading state
      const delayedResponse = await delayRequest(response);
      const { id, title, price, brand } =
        (await delayedResponse.json()) as Product;
      setData({ method: "POST", data: { id, title, price, brand } });
    } catch (err) {
      if (err instanceof Error)
        setError(
          `${err?.name || "Error"}: ${err?.message || "Unexpected error"}`,
        );
      console.error(err);
    }

    setIsLoading(false);
  }, [newProduct]);

  return (
    <Box>
      <Typography variant="h4" paragraph>
        Simple Fetch
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

export default SimpleFetch;
