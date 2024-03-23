// Project import
import { ProfileTab } from "layouts/ProfileTab";
import { MenuItemType } from "layouts/menuItems";
import NavItem from "./NavItem";

// MUI components
import { Box, Divider, Drawer, List } from "@mui/material";

type NavbarProps = {
  open: boolean;
  onToggle: (
    open: boolean,
  ) => React.MouseEventHandler<HTMLDivElement> | undefined;
  menuItems: MenuItemType[];
  window?: () => Window;
};

const drawerWidth = 240;

const Navbar = ({ open, onToggle, menuItems, window }: NavbarProps) => {
  const container =
    window !== undefined ? () => window().document.body : undefined;
  const items = menuItems.map((item) => (
    <NavItem
      key={item.id}
      title={item.title}
      url={item.url}
      icon={item?.icon}
    />
  ));

  return (
    <Drawer
      component="nav"
      container={container}
      variant="temporary"
      open={open}
      onClose={onToggle(false)}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Box component="div" onClick={onToggle(false)}>
        <ProfileTab direction="column" isNavbarOpen={open} sx={{ my: 3 }} />
        <Divider sx={{ borderWidth: "1px" }} />
        <List sx={{ py: 0 }}>{items}</List>
      </Box>
    </Drawer>
  );
};

export default Navbar;
