import { Box, Stack } from "@mui/material";
import ContentCard from "../../components/ContentCard";
import SimpleFetch from "./SimpleFetch";

const Fetch = () => {
  return (
    <Box mx={3}>
      <Stack mt={5}>
        <ContentCard>
          <SimpleFetch />
        </ContentCard>
      </Stack>
    </Box>
  );
};

export default Fetch;
