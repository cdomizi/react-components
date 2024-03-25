import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mediaQuery from "css-mediaquery";
import { MemoryRouter, Route, Routes } from "react-router-dom";

// Project import
import Posts from "@Posts/index";
import Todos from "@Todos/index";
import RootLayout from "layouts/RootLayout";
import { ThemeCustomization } from "layouts/ThemeCustomization";
import { ColorModeSwitch } from "layouts/TopBar/ColorModeSwitch";

// MUI components
import { AppBar } from "@mui/material";

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

const MockLayout = () => (
  <ThemeCustomization>
    <AppBar>
      <ColorModeSwitch />
    </AppBar>
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

    render(
      <MemoryRouter>
        <MockRoutes />
      </MemoryRouter>,
    );

    expect(() => screen.getByRole("button", { name: /menu/i })).toThrow();
  });

  test("displays menu button on screen width < 600px", () => {
    window.matchMedia = createMatchMedia(599);

    render(
      <MemoryRouter>
        <MockRoutes />
      </MemoryRouter>,
    );

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
  let originalMatchmedia: (query: string) => MediaQueryList;

  beforeEach(() => {
    originalMatchmedia = window.matchMedia;
    // delete window.matchMedia;
  });

  afterEach(() => {
    window.matchMedia = originalMatchmedia;
  });

  test("navbar is closed by default", () => {
    window.matchMedia = createMatchMedia(599);

    render(
      <MemoryRouter>
        <MockRoutes />
      </MemoryRouter>,
    );

    expect(() => screen.getByRole("presentation")).toThrow();
  });

  test("toggle navbar", async () => {
    window.matchMedia = createMatchMedia(599);
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <MockRoutes />
      </MemoryRouter>,
    );

    // Navbar is initially closed
    expect(() => screen.getByRole("presentation")).toThrow();

    const menuButton = screen.getByRole("button", { name: /menu/i });

    // Open the navbar
    await user.click(menuButton);

    // Navbar is open
    const navbar = screen.getByRole("presentation");

    expect(navbar).toBeInTheDocument();
    expect(navbar).toBeVisible();

    // Close the navbar
    await user.keyboard("{Escape}");

    // Navbar is closed
    expect(() => screen.getByRole("presentation")).toThrow();
  });

  test("navbar shows active link for current page", async () => {
    window.matchMedia = createMatchMedia(599);
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/todos"]}>
        <MockRoutes />
      </MemoryRouter>,
    );

    const menuButton = screen.getByRole("button", { name: /menu/i });

    // Open the navbar
    await user.click(menuButton);

    const todosNavLink = screen.getByRole("button", { name: /todos/i });
    const postsNavLink = screen.getByRole("button", { name: /posts/i });

    await waitFor(() =>
      expect(todosNavLink.parentElement?.parentElement).toHaveClass("active"),
    );
    expect(postsNavLink.parentElement?.parentElement).not.toHaveClass("active");
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
    expect(screen.getByTestId("dark-mode-icon")).toBeInTheDocument();
  });

  test("toggle color mode", async () => {
    const user = userEvent.setup();

    render(<MockLayout />);

    const header = screen.getByRole("banner");
    const themeToggle = screen.getByRole("button", { name: /dark mode/i });
    const darkThemeIcon = screen.getByTestId("dark-mode-icon");

    // Theme has light color mode by default
    expect(getComputedStyle(header).backgroundColor).toBe(
      lightThemeBackgroundColor,
    );
    // Color switch has dark mode icon
    expect(darkThemeIcon).toBeInTheDocument();
    expect(() => screen.getByTestId("light-mode-icon")).toThrow();

    // Toggle theme mode
    await user.click(themeToggle);

    const lightThemeIcon = screen.getByTestId("light-mode-icon");

    // Header has light background color after toggling color mode
    expect(getComputedStyle(header).backgroundColor).toBe(
      darkThemeBackgroundColor,
    );
    // Color switch has light mode icon
    expect(
      screen.getByRole("button", { name: /light mode/i }),
    ).toBeInTheDocument();
    expect(lightThemeIcon).toBeInTheDocument();
    expect(() => screen.getByTestId("dark-mode-icon")).toThrow();
  });
});
