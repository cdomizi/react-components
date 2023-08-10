import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";

const TopBar = () => (
  <>
    <AppBar>
      <Toolbar>
        <Box>
          <Typography
            component="a"
            href="/"
            variant="h6"
            sx={{ color: "inherit", textDecoration: "none" }}
          >
            myApp
          </Typography>
        </Box>
        <Button
          variant="contained"
          href="login"
          sx={{
            ml: "auto",
            color: "primary.main",
            backgroundColor: "primary.contrastText",
            "&:hover": {
              color: "primary.dark",
              backgroundColor: "primary.contrastText",
            },
          }}
        >
          Login
        </Button>
        <Button href="profile" sx={{ color: "primary.contrastText" }}>
          Hi, User
        </Button>
      </Toolbar>
    </AppBar>
  </>
);

export default TopBar;
