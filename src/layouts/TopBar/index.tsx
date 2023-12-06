import { HomeButton } from "./HomeButton";
import { MenuItemsList } from "./MenuItemsList";
import { ColorModeSwitch } from "./ColorModeSwitch";

import { AppBar, Stack, Toolbar } from "@mui/material";

export const TopBar = () => {
  return (
    <AppBar>
      <Toolbar>
        <HomeButton />
        <Stack direction="row" spacing={2} ml="auto">
          <MenuItemsList />
          <ColorModeSwitch />
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
