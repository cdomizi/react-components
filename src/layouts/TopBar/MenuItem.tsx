import { useNavigate } from "react-router";

import { Typography } from "@mui/material";

interface MenuItemProps {
  title: string;
  url: string;
}

const MenuItem = ({ title, url }: MenuItemProps) => {
  const navigate = useNavigate();

  return (
    <Typography
      onClick={() => navigate(url)}
      noWrap
      component="a"
      sx={{
        color: "inherit",
        textDecoration: "none",
        mr: 4,
        cursor: "pointer",
      }}
    >
      {title.toUpperCase()}
    </Typography>
  );
};

export default MenuItem;
