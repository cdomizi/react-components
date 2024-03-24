/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mediaQuery from "css-mediaquery";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";

// Project import
import Posts from "@Posts/index";
import Todos from "@Todos/index";
import { MenuButton } from "layouts/TopBar/MenuButton";
import { menuItems } from "layouts/menuItems";
import RootLayout from "../RootLayout";
import { ThemeCustomization } from "../ThemeCustomization";
import { TopBar } from "../TopBar";
import { ColorModeSwitch } from "../TopBar/ColorModeSwitch";
import { MenuItem } from "../TopBar/MenuItem";

import { AppBar } from "@mui/material";

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

const toggleDrawer = vi.fn();

vi.mock("../TopBar", () => ({
  TopBar: () => (
    <AppBar>
      <MenuButton onToggle={toggleDrawer} />
      <ColorModeSwitch />
    </AppBar>
  ),
}));

const mockToggleDrawer = vi.fn();

const MockLayout = () => (
  <ThemeCustomization>
    <TopBar onToggle={mockToggleDrawer} menuItems={menuItems} />
  </ThemeCustomization>
);

// Header background colors for light and dark mode
const lightThemeBackgroundColor = "#1976d2";
const darkThemeBackgroundColor = "#121212";

const createMatchMedia = (width: number) => {
  return (query: string): MediaQueryList => ({
    matches: mediaQuery.match(query, { width }),
    media: "",
    addListener: () => vi.fn(),
    removeListener: () => vi.fn(),
    onchange: () => vi.fn(),
    addEventListener: () => vi.fn(),
    removeEventListener: () => vi.fn(),
    dispatchEvent: () => true,
  });
};

describe("topbar", () => {
  let originalMatchmedia: (query: string) => MediaQueryList;

  beforeEach(() => {
    originalMatchmedia = window.matchMedia;
    // delete window.matchMedia;
  });

  afterEach(() => {
    window.matchMedia = originalMatchmedia;
  });

  test("does not display menu button on screen width >= 600px", () => {
    window.matchMedia = createMatchMedia(window.innerWidth);

    render(<MockLayout />);

    expect(() => screen.getByRole("button", { name: /menu/i })).toThrow();
  });

  test("displays menu button on screen width < 600px", () => {
    window.matchMedia = createMatchMedia(599);

    render(<MockLayout />);

    const menuButton = screen.getByRole("button", { name: /menu/i });

    expect(menuButton).toBeInTheDocument();
  });

  test("displays active nav link based on current page", async () => {
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

describe("navbar", () => {
  test.todo("navbar is closed by default");

  test.todo("toggle navbar");

  test.todo("navbar shows active link for current page");
});

describe("color mode", () => {
  test("default color mode set based on browser preference", () => {
    render(<MockLayout />);

    // Header background color and toggle button for default theme (light)
    const header = screen.getByRole("banner");
    const themeToggle = screen.getByRole("button", {
      name: /light mode/i,
    });

    expect(getComputedStyle(header).backgroundColor).toBe(
      darkThemeBackgroundColor,
    );
    expect(themeToggle).toBeInTheDocument();
    expect(screen.getByTestId("light-mode-icon")).toBeInTheDocument();
  });

  test("toggle color mode", async () => {
    const user = userEvent.setup();

    render(<MockLayout />);

    const header = screen.getByRole("banner");
    const themeToggle = screen.getByRole("button", { name: /light mode/i });
    const lightThemeIcon = screen.getByTestId("light-mode-icon");

    // Header has dark background color by default
    expect(getComputedStyle(header).backgroundColor).toBe(
      darkThemeBackgroundColor,
    );
    // Color switch has light mode icon
    expect(lightThemeIcon).toBeInTheDocument();
    expect(() => screen.getByTestId("dark-mode-icon")).toThrow();

    // Toggle light theme
    await user.click(themeToggle);

    const darkThemeIcon = screen.getByTestId("dark-mode-icon");

    // Header has light background color after toggling color mode
    expect(getComputedStyle(header).backgroundColor).toBe(
      lightThemeBackgroundColor,
    );
    // Color switch has dark mode icon
    expect(
      screen.getByRole("button", { name: /dark mode/i }),
    ).toBeInTheDocument();
    expect(darkThemeIcon).toBeInTheDocument();
    expect(() => screen.getByTestId("light-mode-icon")).toThrow();
  });
});
