import { render, screen } from "@testing-library/react";
import Home from "../Home";

describe("Home page", () => {
  test("render Home component", () => {
    render(<Home />);
    const heading = screen.getByRole("heading");

    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/home/i);
  });
});
