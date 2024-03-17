import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";

// Project import
import Posts from "@Posts/index";
import Todos from "@Todos/index";
import { AppBar } from "@mui/material";
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

vi.mock("@Todos/index", () => ({
  default: () => (
    <div>
      <h2>Todo List</h2>
    </div>
  ),
}));

vi.mock("@Posts/index", () => ({
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

// Header background colors for light and dark mode
const lightThemeBackgroundColor = "#1976d2";
const darkThemeBackgroundColor = "#121212";

describe("navbar", () => {
  test("navbar shows active link for current page", async () => {
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
  test("default color mode set based on browser preference", () => {
    render(<MockLayout />);

    // Header background color and toggle button for default theme (light)
    const header = screen.getByRole("banner");
    const themeToggle = screen.getByRole("button", {
      name: /dark mode/i,
    });

    expect(getComputedStyle(header).backgroundColor).toBe(
      lightThemeBackgroundColor,
    );
    expect(themeToggle).toBeInTheDocument();
  });

  test("toggle color mode", async () => {
    const user = userEvent.setup();

    render(<MockLayout />);

    const header = screen.getByRole("banner");
    const themeToggle = screen.getByRole("button", { name: /dark mode/i });
    const lightThemeIcon = screen.getByTestId("light-mode-icon");

    // Header has light background color by default
    expect(getComputedStyle(header).backgroundColor).toBe(
      lightThemeBackgroundColor,
    );
    // Color switch has dark mode icon
    expect(lightThemeIcon).toBeInTheDocument();
    expect(() => screen.getByTestId("dark-mode-icon")).toThrow();

    // Toggle dark theme
    await user.click(themeToggle);

    const darkThemeIcon = screen.getByTestId("dark-mode-icon");

    // Header has dark background color after toggling color mode
    expect(getComputedStyle(header).backgroundColor).toBe(
      darkThemeBackgroundColor,
    );
    // Color switch has light mode icon
    expect(darkThemeIcon).toBeInTheDocument();
    expect(() => screen.getByTestId("light-mode-icon")).toThrow();
  });
});
