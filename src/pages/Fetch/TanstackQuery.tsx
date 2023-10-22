import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";

import { Product, ProductQuery } from "./index";
import { delayAxiosRequest } from "../../utils/delay";
import { Logger } from "../../components/Logger";

import { Box, Button, Typography } from "@mui/material";

export const TanstackQuery = () => {
  const [isProductFetched, setIsProductFetched] = useState(false);
  const getProduct = async (): Promise<ProductQuery> =>
    // Artificially delay function to show loading state
    delayAxiosRequest(await axios.get("https://dummyjson.com/product/1"));

  const productQuery = useQuery<ProductQuery, AxiosError<Product>>({
    queryKey: ["product"],
    queryFn: getProduct,
    enabled: isProductFetched,
  });

  const getResult = (() => {
    if (!isProductFetched) return null;

    switch (productQuery.status) {
      case "loading":
        return "loading...";
      case "error": {
        const { code, response, message } = productQuery.error;
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        return `${code} ${response?.status || 500}: ${message}`;
      }
      case "success": {
        const {
          data: { id, title, brand, price },
        } = productQuery.data;
        return {
          method: "GET",
          data: { id, title, brand, price },
        };
      }
      default:
        return null;
    }
  })();

  const newProduct: Product = useMemo(
    () => ({
      title: "Ethernet Cable",
      price: 12,
      brand: "genTech",
    }),
    [],
  );

  const productMutation = useMutation<
    AxiosResponse<Product>,
    AxiosError<Product>,
    Product,
    unknown
  >({
    mutationFn: async (product) =>
      delayAxiosRequest(
        await axios.post("https://dummyjson.com/product/add", product),
      ),
  });

  const addResult = (() => {
    switch (productMutation.status) {
      case "loading":
        return "loading...";
      case "error": {
        const { code, response, message } = productMutation.error;
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        return `${code} ${response?.status || 500}: ${message}`;
      }
      case "success": {
        const {
          data: { id, title, brand, price },
        } = productMutation.data;
        return {
          method: "GET",
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
        onClick={() => setIsProductFetched(true)}
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
      <Logger value={[getResult, addResult]} />
    </Box>
  );
};
