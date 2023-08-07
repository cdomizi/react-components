import { AppBar, Box, Button, Toolbar } from "@mui/material";

const TopBar = () => (
  <>
    <AppBar>
      <Toolbar>
        <Box>
          <Button sx={{ color: "primary.contrastText" }} href="/">
            Home
          </Button>
          <Button sx={{ color: "primary.contrastText" }} href="/login">
            Login
          </Button>
        </Box>
        <Button
          variant="contained"
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
      </Toolbar>
    </AppBar>
  </>
);

export default TopBar;
