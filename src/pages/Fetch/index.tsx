import { Box, Stack } from "@mui/material";
import ContentCard from "../../components/ContentCard";
import SimpleFetch from "./SimpleFetch";
import Axios from "./Axios";

const Fetch = () => {
  return (
    <Box mx={3}>
      <Stack direction={{ xs: "column", sm: "row" }} mt={5} spacing={3}>
        <ContentCard>
          <SimpleFetch />
        </ContentCard>
        <ContentCard>
          <Axios />
        </ContentCard>
      </Stack>
    </Box>
  );
};

export default Fetch;
