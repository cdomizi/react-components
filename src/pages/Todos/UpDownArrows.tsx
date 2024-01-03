import {
  ArrowDropDown as ArrowDropDownIcon,
  ArrowDropUp as ArrowDropUpIcon,
} from "@mui/icons-material";
import { IconButton, Stack } from "@mui/material";

type PropsType = {
  position: [boolean, boolean];
  moveUp: (params: boolean) => void;
  disabled: boolean;
};

export const UpDownArrows = ({
  position,
  moveUp,
  disabled = false,
}: PropsType) => {
  const [first, last] = position;

  return (
    <Stack direction="column" spacing={-1}>
      <IconButton
        onClick={() => moveUp(true)}
        sx={{ p: 0, m: 0, mt: 0.3 }}
        // Move up disabled on the first element of the list
        disabled={disabled || first}
      >
        <ArrowDropUpIcon />
      </IconButton>
      <IconButton
        onClick={() => moveUp(false)}
        sx={{ p: 0, m: 0 }}
        // Move down disabled on the last element of the list
        disabled={disabled || last}
      >
        <ArrowDropDownIcon />
      </IconButton>
    </Stack>
  );
};
