import { render, screen } from "@testing-library/react";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";

// Project import
import RootLayout from "../RootLayout";
import TopBar from "../TopBar";
import MenuItem from "../TopBar/MenuItem";
import Home from "../../pages/Home";
import Todos from "../../pages/Todos";
import Posts from "../../pages/Posts";

vi.mock("../TopBar", () => ({
  default: () => (
    <header>
      <MenuItem title="todos" url="/todos" />
      <MenuItem title="posts" url="/posts" />
    </header>
  ),
}));

vi.mock("../RootLayout", () => ({
  default: () => (
    <div>
      <TopBar />
      <Outlet />
    </div>
  ),
}));

vi.mock("../../pages/Home", () => ({
  default: () => (
    <div>
      <h2>Home</h2>
    </div>
  ),
}));

vi.mock("../../pages/Todos", () => ({
  default: () => (
    <div>
      <h2>Todo List</h2>
    </div>
  ),
}));

vi.mock("../../pages/Posts", () => ({
  default: () => (
    <div>
      <h2>Posts</h2>
    </div>
  ),
}));

const TestRoutes = () => (
  <Routes>
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Home />} />
      <Route path="/todos" element={<Todos />} />
      <Route path="/posts" element={<Posts />} />
    </Route>
  </Routes>
);

describe("top bar", () => {
  test("active navlinks on top bar", () => {
    const MainRoutes = vi.fn().mockImplementation(TestRoutes);

    render(
      <MemoryRouter initialEntries={["/todos"]}>
        <MainRoutes />
      </MemoryRouter>,
    );

    const todosNavLink = screen.getByRole("link", { name: "TODOS" });
    const postsNavLink = screen.getByRole("link", { name: "POSTS" });

    expect(todosNavLink).toHaveClass("active");
    expect(postsNavLink).not.toHaveClass("active");
  });
});
