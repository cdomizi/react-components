import UncontrolledForm from "./UncontrolledForm";
import ControlledForm from "./ControlledForm";
import ControlledRHF from "./ControlledRHF";

import { Stack } from "@mui/material";

const Forms = () => {
  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={3} m={3}>
      <UncontrolledForm />
      <ControlledForm />
      <ControlledRHF />
    </Stack>
  );
};

export default Forms;
