import { useNavigate } from "react-router-dom";
import MenuItem from "./MenuItem";

import { AppBar, Box, Toolbar, Typography } from "@mui/material";

const menuItems = [{ id: "forms", title: "forms", url: "/forms" }];

const TopBar = () => {
  const navigate = useNavigate();

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
          <Box ml="auto">
            {menuItems.map((item) => (
              <MenuItem key={item.id} title={item.title} url={item.url} />
            ))}
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default TopBar;
