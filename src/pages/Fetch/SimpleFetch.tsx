import { useEffect, useState } from "react";
import Logger from "../../components/Logger";
import { Box, Typography } from "@mui/material";

interface Product {
  id: number;
  title: string;
  price: number;
  brand: string;
}

const SimpleFetch = () => {
  const [data, setData] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch("https://dummyjson.com/product/1");
        const { id, title, price, brand } = (await response.json()) as Product;
        setData({ id, title, price, brand });
      } catch (err) {
        if (err instanceof Error)
          setError(
            `${err?.name || "Error"}: ${err?.message || "Unexpected error"}`,
          );
        console.error(err);
      }
    };

    void getData();
  }, []);

  return (
    <Box>
      <Typography variant="h4">Simple Fetch</Typography>
      <Logger value={data ?? error ?? "loading..."} />
    </Box>
  );
};

export default SimpleFetch;
