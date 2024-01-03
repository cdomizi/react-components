import { ReactElement, useLayoutEffect, useMemo, useState } from "react";
import { ColorModeContext } from "../contexts/ColorModeContext";
import { useLocalStorage } from "../hooks/useLocalStorage";

// MUI components
import {
  CssBaseline,
  PaletteMode,
  ThemeProvider,
  createTheme,
  useMediaQuery,
} from "@mui/material";

export const ThemeCustomization = ({
  children,
}: {
  children: ReactElement;
}) => {
  const { currentValue: initialState, setValue: setColorMode } =
    useLocalStorage<PaletteMode>("colorMode");

  const defaultMode = useMediaQuery<PaletteMode>(
    "(prefers-color-scheme: light)",
  )
    ? "light"
    : "dark";
  // Check for existing color mode setting, else set it according to the browser
  const [mode, setMode] = useState<PaletteMode>(initialState ?? defaultMode);

  // Update color mode setting in localStorage
  useLayoutEffect(() => {
    setColorMode(mode);
  }, [mode, setColorMode]);

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
