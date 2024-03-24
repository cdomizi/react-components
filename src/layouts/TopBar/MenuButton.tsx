import { Menu as MenuIcon } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { BreakpointType } from "types";

export const MenuButton = ({
  onToggle,
  mobileBp = "sm",
}: {
  onToggle: (open: boolean) => React.MouseEventHandler<HTMLButtonElement>;
  mobileBp?: BreakpointType;
}) => {
  return (
    <IconButton
      title="Menu"
      onClick={onToggle(true)}
      color="inherit"
      edge="start"
      sx={{ display: { [mobileBp]: "none" }, mr: 2 }}
    >
      <MenuIcon />
    </IconButton>
  );
};
