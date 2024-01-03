import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";

// Project import
import { AppBar } from "@mui/material";
import Posts from "../../pages/Posts";
import Todos from "../../pages/Todos";
import RootLayout from "../RootLayout";
import { ThemeCustomization } from "../ThemeCustomization";
import { TopBar } from "../TopBar";
import { ColorModeSwitch } from "../TopBar/ColorModeSwitch";
import { MenuItem } from "../TopBar/MenuItem";

vi.mock("../RootLayout", () => ({
  default: () => (
    <div>
      <header>
        <MenuItem title="todos" url="/todos" />
        <MenuItem title="posts" url="/posts" />
      </header>
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

const MockRoutes = () => (
  <Routes>
    <Route path="/" element={<RootLayout />}>
      <Route path="/todos" element={<Todos />} />
      <Route path="/posts" element={<Posts />} />
    </Route>
  </Routes>
);

vi.mock("../TopBar", () => ({
  TopBar: () => (
    <AppBar>
      <ColorModeSwitch />
    </AppBar>
  ),
}));

const MockLayout = () => (
  <ThemeCustomization>
    <TopBar />
  </ThemeCustomization>
);

describe("navbar", () => {
  test("active links on navbar", async () => {
    render(
      <MemoryRouter initialEntries={["/todos"]}>
        <MockRoutes />
      </MemoryRouter>,
    );

    const todosNavLink = screen.getByRole("link", { name: /todos/i });
    const postsNavLink = screen.getByRole("link", { name: /posts/i });

    await waitFor(() => expect(todosNavLink).toHaveClass("active"));
    expect(postsNavLink).not.toHaveClass("active");
  });
});

describe("color mode", () => {
  test("default color mode", () => {
    render(<MockLayout />);

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

    render(<MockLayout />);

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
