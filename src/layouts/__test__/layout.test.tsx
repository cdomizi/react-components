import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";

// Project import
import RootLayout from "../RootLayout";
import { ThemeCustomization } from "../ThemeCustomization";
import { TopBar } from "../TopBar";
import { MenuItem } from "../TopBar/MenuItem";
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
      <Route path="/todos" element={<Todos />} />
      <Route path="/posts" element={<Posts />} />
    </Route>
  </Routes>
);

describe("navbar", () => {
  test("active links on navbar", () => {
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

describe.only("color mode", () => {
  test("default color mode", async () => {
    vi.unmock("../TopBar");
    render(
      <ThemeCustomization>
        <MemoryRouter>
          <Routes>
            <Route path="/" element={<TopBar />} />
          </Routes>
        </MemoryRouter>
      </ThemeCustomization>,
    );

    const header = screen.getByRole("banner");

    await waitFor(
      () => expect(getComputedStyle(header).backgroundColor).toBe("#1976d2"),
      // expect(getComputedStyle(header).backgroundColor).toBe("#121212"),
    );

    const colorModeSwitchButton = screen.getByRole("button", {
      name: "Dark Mode",
      // name: "Light Mode",
    });

    await waitFor(() => expect(colorModeSwitchButton).toBeInTheDocument());
  });
});
