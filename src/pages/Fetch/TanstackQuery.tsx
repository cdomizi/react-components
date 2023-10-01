import Logger from "../../components/Logger";

import { Box, Button, Typography } from "@mui/material";

const TanstackQuery = () => {
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
      <Logger value={null} />
    </Box>
  );
};

export default TanstackQuery;
