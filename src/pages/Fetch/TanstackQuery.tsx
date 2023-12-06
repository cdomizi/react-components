import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";

import { Product } from "../../types";

import { delayAxiosRequest } from "../../utils/delay";
import { Logger } from "../../components/Logger";

import { Box, Button, Stack, Typography } from "@mui/material";

export const TanstackQuery = () => {
  const [error, setError] = useState(false);
  const getProduct = async (): Promise<AxiosResponse<Product>> =>
    // Artificially delay response to show loading state
    delayAxiosRequest(await axios.get("https://dummyjson.com/product/1"));

  const productQuery = useQuery<AxiosResponse<Product>, AxiosError<Product>>({
    queryKey: ["product"],
    queryFn: getProduct,
    enabled: false,
  });

  const getResult = (() => {
    switch (productQuery.status) {
      case "pending":
        return productQuery.isLoading ? "loading..." : null;
      case "error": {
        const { code, response, message } = productQuery.error;
        return `${code} ${response?.status || 500}: ${message}`;
      }
      case "success": {
        const {
          data: { id, title, brand, price },
          config: { method },
        } = productQuery.data;
        return {
          method: method?.toUpperCase(),
          data: { id, title, brand, price },
        };
      }
      default:
        return null;
    }
  })();

  // New sample product
  const newProduct: Product = useMemo(
    () => ({
      title: "Ethernet Cable",
      price: 12,
      brand: "genTech",
    }),
    [],
  );

  // Set up mutation
  const productMutation = useMutation<
    AxiosResponse<Product>,
    AxiosError<Product>,
    Product,
    unknown
  >({
    mutationFn: async (product) =>
      // Artificially delay response to show loading state
      delayAxiosRequest(
        await axios.post(
          // Provide wrong URL if `error` is set to true, else provide valid URL
          error
            ? "https://dummyjson.com/product/add/NOT_FOUND"
            : "https://dummyjson.com/product/add",
          product,
        ),
      ),
  });

  // Output result based on mutation state/outcome
  const addResult = (() => {
    switch (productMutation.status) {
      case "pending":
        return "loading...";
      case "error": {
        const { code, response, message } = productMutation.error;
        return `${code} ${response?.status || 500}: ${message}`;
      }
      case "success": {
        const {
          data: { id, title, brand, price },
          config: { method },
        } = productMutation.data;
        return {
          method: method?.toUpperCase(),
          data: { id, title, brand, price },
        };
      }
      default:
        return null;
    }
  })();

  return (
    <Box>
      <Typography variant="h4" paragraph>
        Tanstack Query
      </Typography>
      <Stack direction="row" flexWrap="wrap" mt={1} gap={1}>
        <Button
          onClick={() => {
            setError(true);
            return productQuery.refetch();
          }}
          variant="outlined"
          size="small"
          disabled={productQuery.isLoading || productMutation.isPending}
        >
          Get product
        </Button>
        <Button
          onClick={() => {
            setError(false);
            return productMutation.mutate(newProduct);
          }}
          variant="outlined"
          size="small"
          disabled={productQuery.isLoading || productMutation.isPending}
        >
          Add product
        </Button>
        <Button
          onClick={() => {
            setError(true);
            return productMutation.mutate(newProduct);
          }}
          variant="outlined"
          size="small"
          disabled={productQuery.isLoading || productMutation.isPending}
          color="error"
        >
          Add product error
        </Button>
      </Stack>
      {/* Show response data/error or loading */}
      <Logger value={[getResult, addResult]} />
    </Box>
  );
};
