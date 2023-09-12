import ControlledForm from "./UncontrolledForm";

import { Stack } from "@mui/material";

const Forms = () => {
  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={3} m={3}>
      <ControlledForm />
    </Stack>
  );
};

export default Forms;
