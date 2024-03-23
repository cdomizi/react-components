import { useAppLocation } from "hooks/useAppLocation";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

// MUI components
import {
  Button,
  Link,
  Stack,
  SxProps,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";

type ProfileTabProps = {
  direction: "column" | "row";
  isNavbarOpen?: boolean;
  sx: SxProps | undefined;
};

export const ProfileTab = ({
  direction = "row",
  isNavbarOpen,
  sx,
}: ProfileTabProps) => {
  const theme = useTheme();

  const navigate = useNavigate();
  const location = useAppLocation();

  // Dummy auth data
  const auth = {
    username: undefined,
    accessToken: undefined,
  };

  // const [retry, setRetry] = useState(false); // State to prevent endless loop

  // Verify refresh access token

  const handleLogout = useCallback(() => {
    try {
      console.log("logout");
      // Delete `jwt` cookie containing the refreshToken

      // Display confirmation message on successful logout

      // Empty out auth context

      // Redirect the user to the home page on successful logout
      // and set sessionExpired to `false` (prevent display warning on login form)
      location.pathname.match(/\/users\/.+/) &&
        navigate("/", { state: { sessionExpired: false } });
    } catch (err) {
      // Display error message on failed logout
      console.error(err);
    }
  }, [location.pathname, navigate]);

  return (
    <Stack
      direction={direction}
      spacing={2}
      useFlexGap
      sx={{ ...sx, alignItems: "center", mr: 2 }}
    >
      {auth?.accessToken ? (
        <>
          <Typography noWrap>
            Hi,{" "}
            <Tooltip title="User's profile">
              <Link
                onClick={() => navigate(`users/${auth?.username}`)}
                sx={{
                  ...(theme.palette.mode === "light" && {
                    color: isNavbarOpen ? "primary.main" : "inherit",
                    textDecorationColor: "inherit",
                  }),
                  cursor: "pointer",
                }}
              >
                {auth?.username}
              </Link>
            </Tooltip>
          </Typography>
          <Button
            variant="outlined"
            onClick={handleLogout}
            sx={{
              whiteSpace: "nowrap",
              ...(theme.palette.mode === "light" &&
                !isNavbarOpen && {
                  color: "primary.contrastText",
                  borderColor: "primary.contrastText",
                  "&:hover": {
                    borderColor: "primary.contrastText",
                    bgcolor: "primary.light",
                  },
                }),
            }}
          >
            Log out
          </Button>
        </>
      ) : (
        <>
          <Button
            variant="contained"
            onClick={() =>
              navigate("/login", { state: { from: location.pathname } })
            }
            sx={{
              ...(theme.palette.mode === "light" && {
                ml: isNavbarOpen ? "inherit" : "auto",
                color: "primary.main",
                bgcolor: "primary.contrastText",
                "&:hover": {
                  color: "primary.contrastText",
                  bgcolor: "primary.light",
                },
              }),
            }}
          >
            Log in
          </Button>
        </>
      )}
    </Stack>
  );
};
