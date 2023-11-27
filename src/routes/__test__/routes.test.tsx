import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Link, MemoryRouter, Outlet, Route, Routes } from "react-router-dom";

// Project import
import RootLayout from "../../layouts/RootLayout";
import TopBar from "../../layouts/TopBar";
import Home from "../../pages/Home";
import ErrorPage from "../../pages/ErrorPage";
import Todos from "../../pages/Todos";

vi.mock("../../layouts/TopBar", () => ({
  default: () => (
    <header>
      <Link to="/">myApp</Link>
      <Link to="/todos">Todos</Link>
    </header>
  ),
}));

vi.mock("../../layouts/RootLayout", () => ({
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

vi.mock("../../pages/ErrorPage", () => ({
  default: () => (
    <div>
      <p>Error</p>
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

const TestRoutes = () => (
  <Routes>
    <Route path="/" element={<RootLayout />} errorElement={<ErrorPage />}>
      <Route index element={<Home />} />
      <Route path="/todos" element={<Todos />} />
    </Route>
  </Routes>
);

describe("router", () => {
  test("render home page on default route", () => {
    const MainRoutes = vi.fn().mockImplementation(TestRoutes);

    render(
      <MemoryRouter>
        <MainRoutes />
      </MemoryRouter>,
    );
    const pageTitle = screen.getByRole("heading");

    expect(pageTitle).toMatch(/home/i);
  });

  test("render page component for specific route", () => {
    const MainRoutes = vi.fn().mockImplementation(TestRoutes);

    render(
      <MemoryRouter initialEntries={["/todos"]}>
        <MainRoutes />
      </MemoryRouter>,
    );
    const pageTitle = screen.getByRole("heading");

    expect(pageTitle).toMatch(/todo list/i);
  });

  test("navigation from the top bar's home button", async () => {
    const MainRoutes = vi.fn().mockImplementation(TestRoutes);

    render(
      <MemoryRouter initialEntries={["/todos"]}>
        <MainRoutes />
      </MemoryRouter>,
    );
    const user = userEvent.setup();
    const homeButton = screen.getByText(/myapp/i);

    await user.click(homeButton);

    const pageTitle = screen.getByRole("heading");
    expect(pageTitle).toMatch(/home/i);
  });

  test("navigation from the topbar links", async () => {
    const MainRoutes = vi.fn().mockImplementation(TestRoutes);

    render(
      <MemoryRouter>
        <MainRoutes />
      </MemoryRouter>,
    );
    const user = userEvent.setup();
    const todosNavLink = screen.getByRole("link", { name: "Todos" });

    await user.click(todosNavLink);

    const pageTitle = screen.getByRole("heading");
    expect(pageTitle).toMatch(/todo list/i);
  });
});
