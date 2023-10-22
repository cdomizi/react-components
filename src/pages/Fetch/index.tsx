import { SimpleFetch } from "./SimpleFetch";
import { Axios } from "./Axios";
import { TanstackQuery } from "./TanstackQuery";
import { ContentCard } from "../../components/{ContentCard}";

import { Box, Stack } from "@mui/material";

const Fetch = () => {
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
