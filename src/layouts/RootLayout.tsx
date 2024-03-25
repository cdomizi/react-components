import { useState } from "react";
import { Outlet } from "react-router-dom";
import { BreakpointType } from "types";
import { Navbar } from "./Navbar";
import { TopBar } from "./TopBar";
import { menuItems } from "./menuItems";

import { Box, Container, Toolbar } from "@mui/material";

const RootLayout = () => {
  // Breakpoint for mobile view
  const mobileBp: BreakpointType = "sm";

  const [drawerState, setDrawerState] = useState(false);

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (event instanceof KeyboardEvent) {
        if (
          event.type === "keydown" &&
          (event?.key === "Tab" || event?.key === "Shift")
        ) {
          return;
        }
      }

      setDrawerState(open);
    };

  return (
    <Box id="root-layout-container">
      <TopBar
        onToggle={toggleDrawer}
        menuItems={menuItems}
        mobileBp={mobileBp}
      />
      <Navbar
        open={drawerState}
        onToggle={toggleDrawer}
        menuItems={menuItems}
      />
      <Container maxWidth="xl">
        <Box component="main" flexGrow={1} p={3}>
          <Toolbar />
          <Outlet />
        </Box>
      </Container>
    </Box>
  );
};

export default RootLayout;
