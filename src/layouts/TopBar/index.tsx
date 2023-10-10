import { useNavigate } from "react-router-dom";
import MenuItem from "./MenuItem";

import { AppBar, Box, Stack, Toolbar, Typography } from "@mui/material";

const menuItems = [
  { id: "forms", title: "forms", url: "/forms" },
  { id: "fetch", title: "fetch", url: "/fetch" },
  { id: "todos", title: "todos", url: "/todos" },
  { id: "posts", title: "posts", url: "/posts" },
];

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
          <Stack direction="row" spacing={2} ml="auto">
            {menuItems.map((item) => (
              <MenuItem key={item.id} title={item.title} url={item.url} />
            ))}
          </Stack>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default TopBar;
