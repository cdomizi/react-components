import { render, screen } from "@testing-library/react";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";

// Project import
import RootLayout from "../../layouts/RootLayout";
import Home from "../../pages/Home";
import ErrorPage from "../../pages/ErrorPage";
import Todos from "../../pages/Todos";

vi.mock("../../layouts/RootLayout", () => ({
  default: () => (
    <div>
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
  test("renders home page on default route", () => {
    const MainRoutes = vi.fn().mockImplementation(TestRoutes);

    render(
      <MemoryRouter>
        <MainRoutes />
      </MemoryRouter>,
    );
    const pageTitle = screen.getByRole("heading");

    expect(pageTitle).toMatch(/home/i);
  });

  test("renders page component for specific route", () => {
    const MainRoutes = vi.fn().mockImplementation(TestRoutes);

    render(
      <MemoryRouter initialEntries={["/todos"]}>
        <MainRoutes />
      </MemoryRouter>,
    );
    const pageTitle = screen.getByRole("heading");

    expect(pageTitle).toMatch(/todo list/i);
  });
});
