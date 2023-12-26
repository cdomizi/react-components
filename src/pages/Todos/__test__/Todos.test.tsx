import { render, screen } from "@testing-library/react";
import Todos from "..";

describe("Todos", () => {
  test("component renders correctly", () => {
    render(<Todos />);

    const title = screen.getByRole("heading");
    const newTodoField = screen.getByRole("textbox");

    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent(/todo list/i);
    expect(newTodoField).toBeInTheDocument();
    // New todo field is empty by default
    expect(newTodoField).toHaveValue("");
    // Todos list is empty dy default
    expect(screen.getByText(/your list is empty/i)).toBeInTheDocument();
    expect(() => {
      screen.getByRole("listitem");
    }).toThrow();
  });

  test.todo("todosReducer");

  test.todo("add and delete todo");

  test.todo("check and uncheck todo");

  test.todo("edit todo");

  test.todo("move todo up/down the list");
});
