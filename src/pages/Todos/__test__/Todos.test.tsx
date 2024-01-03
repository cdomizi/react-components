import { render, screen } from "@testing-library/react";
import Todos from "..";
import { todosReducer } from "../todosReducer";

describe("Todos", () => {
  describe("todosReducer", () => {
    test.todo("add", () => {});

    test.todo("edit");

    test.todo("delete");

    test.todo("toggle");

    test.todo("move");
  });

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

  test.todo("add and delete todo");

  test.todo("check and uncheck todo");

  test.todo("edit todo");

  test.todo("move todo up/down the list");
});
