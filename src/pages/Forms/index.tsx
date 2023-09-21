import UncontrolledForm from "./UncontrolledForm";
import ControlledForm from "./ControlledForm";
import ControlledRHF from "./ControlledRHF";
import UncontrolledRHF from "./UncontrolledRHF";
import CheckboxForm from "./CheckboxForm";
import ArrayForm from "./ArrayForm";

import { Stack } from "@mui/material";

const Forms = () => {
  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={3} m={3}>
      <UncontrolledForm />
      <ControlledForm />
      <ControlledRHF />
      <UncontrolledRHF />
      <CheckboxForm />
      <ArrayForm />
    </Stack>
  );
};

export default Forms;
