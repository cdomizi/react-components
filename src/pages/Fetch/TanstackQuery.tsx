import { useMemo, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";

import { delayAxiosRequest } from "../../utils/delay";
import Logger from "../../components/Logger";

import { Box, Button, Typography } from "@mui/material";

type Product = {
  id?: number;
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

  const getQuery = useQuery<ProductQuery, AxiosError<Product>>({
    queryKey: ["product"],
    queryFn: getProduct,
    enabled: isProductFetched,
  });

  const ethernetCable = useMemo(
    (): Product => ({
      title: "Ethernet Cable",
      brand: "genTech",
      price: 12,
    }),
    [],
  );

  const getResult = (() => {
    if (!isProductFetched) return null;

    switch (getQuery.status) {
      case "loading":
        return "loading...";
      case "error": {
        const { code, response, message } = getQuery.error;
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        return `${code} ${response?.status || 500}: ${message}`;
      }
      case "success": {
        const {
          data: { id, title, brand, price },
        } = getQuery.data;
        return {
          method: "GET",
          data: { id, title, brand, price },
        };
      }
      default:
        return null;
    }
  })();

  const addProduct = useMutation<
    AxiosResponse<Product>,
    AxiosError<Product>,
    Product,
    unknown
  >({
    mutationFn: (newProduct: Product) =>
      delayAxiosRequest(
        axios.post("https://dummyjson.com/product/add", newProduct),
      ),
  });

  const addResult = (() => {
    switch (addProduct.status) {
      case "loading":
        return "loading...";
      case "error": {
        const { code, response, message } = addProduct.error;
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        return `${code} ${response?.status || 500}: ${message}`;
      }
      case "success": {
        const {
          data: { id, title, brand, price },
        } = addProduct.data;
        return {
          method: "POST",
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
        onClick={() => {
          addProduct.mutate(ethernetCable);
        }}
        variant="outlined"
        size="small"
      >
        Add product
      </Button>
      <Logger value={[getResult, addResult]} />
    </Box>
  );
};

export default TanstackQuery;
