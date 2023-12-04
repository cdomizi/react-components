import { NavLink } from "react-router-dom";

import { Button } from "@mui/material";

type MenuItemProps = {
  title: string;
  url: string;
};

export const MenuItem = ({ title, url }: MenuItemProps) => (
  <NavLink
    to={url}
    style={({ isActive }) => ({
      color: "inherit",
      textDecoration: "none",
      ...(isActive && {
        borderBottom: "3px solid white",
        borderRadius: 0,
      }),
    })}
  >
    <Button sx={{ color: "inherit" }}>{title.toUpperCase()}</Button>
  </NavLink>
);
