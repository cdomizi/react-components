import { BreakpointType } from "types";

import { Menu as MenuIcon } from "@mui/icons-material";
import { IconButton, useMediaQuery, useTheme } from "@mui/material";

export const MenuButton = ({
  onToggle,
  mobileBp = "sm",
}: {
  onToggle: (open: boolean) => React.MouseEventHandler<HTMLButtonElement>;
  mobileBp?: BreakpointType;
}) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up(mobileBp));

  return (
    <IconButton
      title="Menu"
      onClick={onToggle(true)}
      color="inherit"
      edge="start"
      sx={{ display: matches ? "none" : "inline-flex", mr: 2 }}
    >
      <MenuIcon />
    </IconButton>
  );
};
