import { Checklist, EditNote, Feed, Http } from "@mui/icons-material";
import { ReactElement } from "react";

export type MenuItemType = {
  id: number;
  title: string;
  url: string;
  icon?: ReactElement;
};

export const menuItems: MenuItemType[] = [
  {
    id: 0,
    title: "forms",
    url: "/forms",
    icon: <EditNote />,
  },
  {
    id: 1,
    title: "fetch",
    url: "/fetch",
    icon: <Http />,
  },
  {
    id: 2,
    title: "todos",
    url: "/todos",
    icon: <Checklist />,
  },
  {
    id: 3,
    title: "posts",
    url: "/posts",
    icon: <Feed />,
  },
];
