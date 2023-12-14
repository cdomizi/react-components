import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";

// Project import
import RootLayout from "../RootLayout";
import { ThemeCustomization } from "../ThemeCustomization";
import { TopBar } from "../TopBar";
import { MenuItem } from "../TopBar/MenuItem";
import { ColorModeSwitch } from "../TopBar/ColorModeSwitch";
import Todos from "../../pages/Todos";
import Posts from "../../pages/Posts";
import { AppBar } from "@mui/material";

vi.mock("../TopBar", () => ({
  TopBar: () => (
    <header>
      <MenuItem title="todos" url="/todos" />
      <MenuItem title="posts" url="/posts" />
      <ColorModeSwitch />
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

const TestLayout = () => (
  <ThemeCustomization>
    <TopBar />
  </ThemeCustomization>
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
  test("default color mode", () => {
    vi.mock("../TopBar", () => ({
      TopBar: () => (
        <AppBar>
          <ColorModeSwitch />
        </AppBar>
      ),
    }));

    render(<TestLayout />);

    // Header background color and toggle button for default theme (light)
    const header = screen.getByRole("banner");
    const themeToggle = screen.getByRole("button", {
      name: /dark mode/i,
    });

    expect(getComputedStyle(header).backgroundColor).toBe("#1976d2");
    expect(themeToggle).toBeInTheDocument();
  });

  test("toggle color mode", async () => {
    const user = userEvent.setup();

    vi.mock("../TopBar", () => ({
      TopBar: () => (
        <AppBar>
          <ColorModeSwitch />
        </AppBar>
      ),
    }));

    render(<TestLayout />);

    const header = screen.getByRole("banner");
    const themeToggle = screen.getByRole("button", { name: /dark mode/i });

    // Check default header background color (light theme)
    expect(getComputedStyle(header).backgroundColor).toBe("#1976d2");

    // Toggle dark theme
    await user.click(themeToggle);

    // Check dark header background color after theme toggle
    expect(getComputedStyle(header).backgroundColor).toBe("#121212");
  });
});
