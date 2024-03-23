import { NavLink } from "react-router-dom";

import {
  capitalize,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { ReactElement } from "react";

type NavItemProps = { title: string; url: string; icon?: ReactElement };

const NavItem = ({ title, url, icon }: NavItemProps) => {
  return (
    <NavLink
      to={url}
      className={({ isActive }) => (isActive ? "active" : "")}
      style={{ color: "inherit", textDecoration: "none" }}
    >
      <ListItem sx={{ color: "inherit" }} disablePadding>
        <ListItemButton sx={{ ".active &&": { bgcolor: "action.selected" } }}>
          {icon && <ListItemIcon>{icon}</ListItemIcon>}
          <ListItemText
            primary={capitalize(title)}
            primaryTypographyProps={{ variant: "h6" }}
          />
        </ListItemButton>
      </ListItem>
    </NavLink>
  );
};

export default NavItem;
