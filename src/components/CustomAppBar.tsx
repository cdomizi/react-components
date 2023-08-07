import { AppBar, Button, Toolbar, Typography } from "@mui/material";

const CustomAppBar = () => (
  <>
    <AppBar>
      <Toolbar>
        <Typography>myApp</Typography>
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

export default CustomAppBar;
