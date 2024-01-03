import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

  test("add and delete todo", async () => {
    const textContent = "New todo";

    const user = userEvent.setup();

    render(<Todos />);

    // Todos list is empty dy default
    expect(screen.getByText(/your list is empty/i)).toBeInTheDocument();

    const addButton = screen.getByRole("button", { name: /add/i });

    expect(addButton).toBeInTheDocument();

    // Add empty todo
    await user.click(addButton);

    const newTodo = screen.getByRole("textbox");

    // New todo field displays error
    expect(newTodo.parentElement).toHaveClass("Mui-error");

    // Add new todo
    await user.type(newTodo, textContent);
    await user.click(addButton);

    const todoList = screen.getByRole("list");
    const listItems = screen.getAllByRole("listitem");
    const doneCheckbox = screen.getByRole("checkbox");
    const deleteButton = screen.getByRole("link", { name: "delete" });
    const todo = screen.getByText(textContent);

    // New todo displays correctly
    expect(() => screen.getByText(/your list is empty/i)).toThrow();
    expect(todoList).toBeInTheDocument();
    expect(listItems).toHaveLength(1);
    expect(doneCheckbox).toBeInTheDocument();
    expect(doneCheckbox).not.toBeChecked();
    expect(deleteButton).toBeInTheDocument();
    expect(todo).toBeInTheDocument();
    expect(todo).toBeInTheDocument();

    // Delete todo
    await user.click(deleteButton);

    // Todo list is empty
    expect(screen.getByText(/your list is empty/i)).toBeInTheDocument();
    expect(todo).not.toBeInTheDocument();
  });

  test.todo("check and uncheck todo");

  test.todo("edit todo");

  test.todo("move todo up/down the list");
});
