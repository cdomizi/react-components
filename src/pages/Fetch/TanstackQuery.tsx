import { useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";

import { Product } from "../../types";

import { delayAxiosRequest } from "../../utils/delay";
import { Logger } from "../../components/Logger";

import { Box, Button, Typography } from "@mui/material";

export const TanstackQuery = () => {
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
        await axios.post("https://dummyjson.com/product/add", product),
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
      <Button
        onClick={() => productQuery.refetch()}
        variant="outlined"
        size="small"
      >
        Get product
      </Button>
      <Button
        onClick={() => productMutation.mutate(newProduct)}
        variant="outlined"
        size="small"
      >
        Add product
      </Button>
      {/* Show response data/error or loading */}
      <Logger value={[getResult, addResult]} />
    </Box>
  );
};
