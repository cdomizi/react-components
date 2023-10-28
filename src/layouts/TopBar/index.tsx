import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { ColorModeContext } from "../../contexts/ColorModeContext";
import MenuItem from "./MenuItem";

// MUI components & icons
import {
  AppBar,
  Box,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import {
  Brightness4 as LightModeIcon,
  Brightness7 as DarkModeIcon,
} from "@mui/icons-material";

const menuItems = [
  { id: "forms", title: "forms", url: "/forms" },
  { id: "fetch", title: "fetch", url: "/fetch" },
  { id: "todos", title: "todos", url: "/todos" },
  { id: "posts", title: "posts", url: "/posts" },
];

const TopBar = () => {
  const navigate = useNavigate();

  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  return (
    <>
      <AppBar>
        <Toolbar>
          <Box>
            <Typography
              component="a"
              onClick={() => navigate("/")}
              variant="h6"
              sx={{
                color: "inherit",
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              myApp
            </Typography>
          </Box>
          <Stack direction="row" spacing={2} ml="auto">
            {menuItems.map((item) => (
              <MenuItem key={item.id} title={item.title} url={item.url} />
            ))}
            <Tooltip
              title={theme.palette.mode === "dark" ? "Light Mode" : "Dark Mode"}
            >
              <IconButton onClick={colorMode.toggleColorMode} color="inherit">
                {theme.palette.mode === "dark" ? (
                  <DarkModeIcon />
                ) : (
                  <LightModeIcon />
                )}
              </IconButton>
            </Tooltip>
          </Stack>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default TopBar;
