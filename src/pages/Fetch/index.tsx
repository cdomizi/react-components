import { ContentCard } from "components/ContentCard";
import { Axios } from "./Axios";
import { SimpleFetch } from "./SimpleFetch";
import { TanstackQuery } from "./TanstackQuery";

import { Box, Stack } from "@mui/material";

export const Fetch = () => {
  return (
    <Box mx={3}>
      <Stack direction={{ xs: "column", sm: "row" }} mt={5} spacing={3}>
        <ContentCard>
          <TanstackQuery />
        </ContentCard>
        <ContentCard>
          <Axios />
        </ContentCard>
        <ContentCard>
          <SimpleFetch />
        </ContentCard>
      </Stack>
    </Box>
  );
};

export default Fetch;
