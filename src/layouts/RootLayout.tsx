import { Outlet } from "react-router-dom";
import TopBar from "./TopBar";
import { Box, Toolbar } from "@mui/material";

const RootLayout = () => (
  <>
    <TopBar />
    <Box component="main">
      <Toolbar />
      <Outlet />
    </Box>
  </>
);

export default RootLayout;
