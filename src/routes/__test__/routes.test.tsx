import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Link, MemoryRouter, Outlet, Route, Routes } from "react-router-dom";

// Project import
import Todos from "@Todos/index";
import RootLayout from "layouts/RootLayout";
import { TopBar } from "layouts/TopBar";
import Home from "pages/Home";

vi.mock("layouts/TopBar", () => ({
  TopBar: () => (
    <header>
      <Link to="/">myApp</Link>
      <Link to="/todos">Todos</Link>
    </header>
  ),
}));

vi.mock("layouts/RootLayout", () => ({
  default: () => (
    <div>
      <TopBar />
      <Outlet />
    </div>
  ),
}));

vi.mock("pages/Home", () => ({
  default: () => (
    <div>
      <h2>Home</h2>
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

const MockRoutes = () => (
  <Routes>
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Home />} />
      <Route path="/todos" element={<Todos />} />
    </Route>
  </Routes>
);

const MockRouter = ({ initialEntries }: { initialEntries?: string[] }) => (
  <MemoryRouter {...(initialEntries?.length && { initialEntries })}>
    <MockRoutes />
  </MemoryRouter>
);

describe("router", () => {
  test("render home page on default route", () => {
    render(<MockRouter />);

    const pageTitle = screen.getByRole("heading");

    expect(pageTitle).toMatch(/home/i);
  });

  test("render page component for specific route", () => {
    render(<MockRouter initialEntries={["/todos"]} />);

    const pageTitle = screen.getByRole("heading");

    expect(pageTitle).toMatch(/todo list/i);
  });

  test("navigation from the top bar's home button", async () => {
    const user = userEvent.setup();

    // Start on Todos page
    render(<MockRouter initialEntries={["/todos"]} />);

    const homeButton = screen.getByText(/myapp/i);

    // Navigate to `Home` by clicking the home button on the navbar
    await user.click(homeButton);

    const pageTitle = screen.getByRole("heading");

    expect(pageTitle).toMatch(/home/i);
  });

  test("navigation from the topbar links", async () => {
    const user = userEvent.setup();

    // Start on Home page
    render(<MockRouter />);

    const todosNavLink = screen.getByRole("link", { name: "Todos" });

    // Navigate to `Todos` by clicking the `todos` navlink
    await user.click(todosNavLink);

    const pageTitle = screen.getByRole("heading");

    expect(pageTitle).toMatch(/todo list/i);
  });
});
