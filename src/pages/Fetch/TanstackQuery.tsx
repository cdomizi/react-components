import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

import { delayAxiosRequest } from "../../utils/delay";
import Logger from "../../components/Logger";

import { Box, Button, Typography } from "@mui/material";

type Product = {
  id: number;
  title: string;
  price: number;
  brand: string;
};

type ProductQuery = {
  method?: "GET" | "POST";
  data: Product;
};

const TanstackQuery = () => {
  const [isProductFetched, setIsProductFetched] = useState(false);
  const getProduct = async (): Promise<ProductQuery> =>
    // Artificially delay function to show loading state
    delayAxiosRequest(await axios.get("https://dummyjson.com/product/1"));

  const productQuery = useQuery<ProductQuery, AxiosError<Product>>({
    queryKey: ["product"],
    queryFn: getProduct,
    enabled: isProductFetched,
  });

  const result = (() => {
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
      <Button onClick={() => null} variant="outlined" size="small">
        Add product
      </Button>
      <Logger value={result} />
    </Box>
  );
};

export default TanstackQuery;
