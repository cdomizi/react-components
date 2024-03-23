import { ProfileTab } from "layouts/ProfileTab";
import { MenuItemType } from "layouts/menuItems";
import { ColorModeSwitch } from "./ColorModeSwitch";
import { HomeButton } from "./HomeButton";
import { MenuItemsList } from "./MenuItemsList";

import { Menu as MenuIcon } from "@mui/icons-material";
import { AppBar, Container, IconButton, Stack, Toolbar } from "@mui/material";

type TopBarProps = {
  onToggle: (open: boolean) => React.MouseEventHandler<HTMLButtonElement>;
  menuItems: MenuItemType[];
};

export const TopBar = ({ onToggle, menuItems }: TopBarProps) => {
  return (
    <AppBar>
      <Container maxWidth="xl">
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            sx={{ display: { sm: "none" }, mr: 2 }}
            onClick={onToggle(true)}
          >
            <MenuIcon />
          </IconButton>
          <HomeButton />
          <Stack direction="row" spacing={2} ml="auto">
            <MenuItemsList menuItems={menuItems} />
            <ProfileTab
              direction="row"
              sx={{ display: { xs: "none", sm: "flex" } }}
            />
            <ColorModeSwitch />
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
