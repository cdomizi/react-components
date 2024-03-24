import { ProfileTab } from "layouts/ProfileTab";
import { MenuItemType } from "layouts/menuItems";
import { BreakpointType } from "types";
import { ColorModeSwitch } from "./ColorModeSwitch";
import { HomeButton } from "./HomeButton";
import { MenuButton } from "./MenuButton";
import { MenuItemsList } from "./MenuItemsList";

import { AppBar, Container, Stack, Toolbar } from "@mui/material";

type TopBarProps = {
  onToggle: (open: boolean) => React.MouseEventHandler<HTMLButtonElement>;
  menuItems: MenuItemType[];
  mobileBp?: BreakpointType;
};

export const TopBar = ({
  onToggle,
  menuItems,
  mobileBp = "sm",
}: TopBarProps) => {
  return (
    <AppBar>
      <Container maxWidth="xl">
        <Toolbar>
          <MenuButton onToggle={onToggle} mobileBp={mobileBp} />
          <HomeButton />
          <Stack direction="row" spacing={2} ml="auto">
            <MenuItemsList menuItems={menuItems} mobileBp={mobileBp} />
            <ProfileTab
              direction="row"
              sx={{ display: { xs: "none", [mobileBp]: "flex" } }}
            />
            <ColorModeSwitch />
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
