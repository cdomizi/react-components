import { useCallback, useState } from "react";
import { delayRequest } from "../../utils/delay";
import Logger from "../../components/Logger";

import { Box, Button, Typography } from "@mui/material";

interface Product {
  method?: string;
  id: number;
  title: string;
  price: number;
  brand: string;
}

const SimpleFetch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getData = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await fetch("https://dummyjson.com/product/1");
      // Artificially delay function to show loading state
      const delayedResponse = (await delayRequest(response)) as Response;
      const { id, title, price, brand } =
        (await delayedResponse.json()) as Product;
      setData({ method: "GET", id, title, price, brand });
    } catch (err) {
      if (err instanceof Error)
        setError(
          `${err?.name || "Error"}: ${err?.message || "Unexpected error"}`,
        );
      console.error(err);
    }

    setIsLoading(false);
  }, []);

  const addProduct = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await fetch("https://dummyjson.com/products/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Ethernet Cable",
          price: "12",
          brand: "genTech",
        }),
      });
      // Artificially delay function to show loading state
      const delayedResponse = (await delayRequest(response)) as Response;
      const { id, title, price, brand } =
        (await delayedResponse.json()) as Product;
      setData({ method: "POST", id, title, price, brand });
    } catch (err) {
      if (err instanceof Error)
        setError(
          `${err?.name || "Error"}: ${err?.message || "Unexpected error"}`,
        );
      console.error(err);
    }

    setIsLoading(false);
  }, []);

  return (
    <Box>
      <Typography variant="h4" paragraph>
        Simple Fetch
      </Typography>
      <Button onClick={getData} variant="outlined" size="small">
        Get product
      </Button>
      <Button onClick={addProduct} variant="outlined" size="small">
        Add product
      </Button>
      <Logger
        value={((isLoading && "loading...") || (data ?? error)) ?? null}
      />
    </Box>
  );
};

export default SimpleFetch;
