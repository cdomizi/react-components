import { MenuItem } from "./MenuItem";

const menuItems = [
  { id: "forms", title: "forms", url: "/forms" },
  { id: "fetch", title: "fetch", url: "/fetch" },
  { id: "todos", title: "todos", url: "/todos" },
  { id: "posts", title: "posts", url: "/posts" },
];

export const MenuItemsList = () => {
  return (
    <>
      {menuItems.map((item) => (
        <MenuItem key={item.id} title={item.title} url={item.url} />
      ))}
    </>
  );
};
