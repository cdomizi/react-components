import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Logger from "../../components/Logger";

import { Box, Button, Typography } from "@mui/material";

const TanstackQuery = () => {
  const result = useQuery({
    queryKey: ["product"],
    queryFn: () => axios.get("https://dummyjson.com/product/1"),
  });

  return (
    <Box>
      <Typography variant="h4" paragraph>
        Tanstack Query
      </Typography>
      <Button onClick={() => null} variant="outlined" size="small">
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
