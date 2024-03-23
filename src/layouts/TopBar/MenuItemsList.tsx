import { Box } from "@mui/material";
import { MenuItemType } from "layouts/menuItems";
import { MenuItem } from "./MenuItem";

export const MenuItemsList = ({ menuItems }: { menuItems: MenuItemType[] }) => {
  return (
    <Box sx={{ display: { xs: "none", sm: "flex" } }}>
      {menuItems.map((item) => (
        <MenuItem key={item.id} title={item.title} url={item.url} />
      ))}
    </Box>
  );
};
