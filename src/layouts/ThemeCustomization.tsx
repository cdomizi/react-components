import { useState, useMemo, useLayoutEffect, ReactElement } from "react";
import { ColorModeContext } from "../contexts/ColorModeContext";

// mui components
import {
  ThemeProvider,
  createTheme,
  useMediaQuery,
  CssBaseline,
  PaletteMode,
} from "@mui/material";

const ThemeCustomization = ({ children }: { children: ReactElement }) => {
  const defaultMode = useMediaQuery<PaletteMode>(
    "(prefers-color-scheme: light)",
  )
    ? "light"
    : "dark";
  // Check for existing color mode setting,
  // else set it according to browser preference
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const initialState =
    (localStorage.getItem("colorMode") as PaletteMode) || defaultMode;
  const [mode, setMode] = useState<PaletteMode>(initialState);

  // update color mode setting in storage
  useLayoutEffect(() => {
    localStorage.setItem("colorMode", mode);
  }, [mode]);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    [],
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default ThemeCustomization;
