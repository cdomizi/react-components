import { useContext } from "react";
import { ColorModeContext } from "../../contexts/ColorModeContext";

// MUI components & icons
import {
  Brightness7 as DarkModeIcon,
  Brightness4 as LightModeIcon,
} from "@mui/icons-material";
import { IconButton, Tooltip, useTheme } from "@mui/material";

export const ColorModeSwitch = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  return (
    <Tooltip title={theme.palette.mode === "dark" ? "Light Mode" : "Dark Mode"}>
      <IconButton onClick={colorMode.toggleColorMode} color="inherit">
        {theme.palette.mode === "dark" ? <DarkModeIcon /> : <LightModeIcon />}
      </IconButton>
    </Tooltip>
  );
};
