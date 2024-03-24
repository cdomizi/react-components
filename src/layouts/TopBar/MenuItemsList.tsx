import { Box } from "@mui/material";
import { MenuItemType } from "layouts/menuItems";
import { BreakpointType } from "types";
import { MenuItem } from "./MenuItem";

export const MenuItemsList = ({
  menuItems,
  mobileBp = "sm",
}: {
  menuItems: MenuItemType[];
  mobileBp?: BreakpointType;
}) => {
  return (
    <Box sx={{ display: { xs: "none", [mobileBp]: "flex" } }}>
      {menuItems.map((item) => (
        <MenuItem key={item.id} title={item.title} url={item.url} />
      ))}
    </Box>
  );
};
