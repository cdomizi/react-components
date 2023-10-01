import { useCallback, useState } from "react";

// Project import
import axios from "axios";
import axiosErrorHandler from "../../utils/axiosErrorHandler";
import Logger from "../../components/Logger";

// MUI components
import { Box, Button, Typography } from "@mui/material";

type Product = {
  method?: "GET" | "POST";
  id: number;
  title: string;
  price: number;
  brand: string;
};

const Axios = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Product | null>(null);

  const getProduct = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await axios.get("https://dummyjson.com/product/1");
      const { id, title, price, brand } = (await response.data) as Product;
      setData({ method: "GET", id, title, price, brand });
    } catch (err) {
      const axiosError = axiosErrorHandler(err) ?? null;
      setError(axiosError);
      console.error(err);
    }

    setIsLoading(false);
  }, []);

  const addProduct = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await axios.post("https://dummyjson.com/product/add", {
        title: "Ethernet Cable",
        price: "12",
        brand: "genTech",
      });
      const { id, title, price, brand } = (await response.data) as Product;
      setData({ method: "POST", id, title, price, brand });
    } catch (err) {
      const axiosError = axiosErrorHandler(err) ?? null;
      setError(axiosError);
      console.error(err);
    }

    setIsLoading(false);
  }, []);

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
      <Logger
        value={((isLoading && "loading...") || (data ?? error)) ?? null}
      />
    </Box>
  );
};

export default Axios;
