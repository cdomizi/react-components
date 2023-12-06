import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";

export const HomeButton = () => {
  const navigate = useNavigate();

  return (
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
  );
};
