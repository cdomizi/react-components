import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Todos from "..";

const initialTodos = [
  { id: "UsXKZeUBML3s", title: "first", done: false },
  { id: "ZznrF4j0KOhe", title: "second", done: false },
  { id: "oaPE6xV6fBFX", title: "third", done: false },
  { id: "63ThxbhB5fRA", title: "fourth", done: false },
];
const setInitialTodos = () => {
  localStorage.setItem("todos", JSON.stringify(initialTodos));
};

afterEach(() => {
  localStorage.clear();
});

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
    const todoTitle = "New todo";

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
    await user.type(newTodo, todoTitle);
    await user.click(addButton);

    const todoList = screen.getByRole("list");
    const listItems = screen.getAllByRole("listitem");
    const doneCheckbox = screen.getByRole("checkbox");
    const deleteButton = screen.getByRole("link", { name: "delete" });
    const todo = screen.getByText(todoTitle);

    // New todo displays correctly
    expect(() => screen.getByText(/your list is empty/i)).toThrow();
    expect(todoList).toBeInTheDocument();
    expect(listItems).toHaveLength(1);
    expect(doneCheckbox).toBeInTheDocument();
    expect(doneCheckbox).not.toBeChecked();
    expect(deleteButton).toBeInTheDocument();
    expect(todo).toBeInTheDocument();
    expect(todo).toHaveTextContent(todoTitle);

    // Delete todo
    await user.click(deleteButton);

    // Todo list is empty
    expect(screen.getByText(/your list is empty/i)).toBeInTheDocument();
    expect(todo).not.toBeInTheDocument();
  });

  test.only("check and uncheck todo", async () => {
    const user = userEvent.setup();

    setInitialTodos();

    render(<Todos />);

    const todoList = screen.getByRole("list");
    const listItems = screen.getAllByRole("listitem");

    // Initial todo list renders correctly
    expect(todoList).toBeInTheDocument();
    expect(listItems).toHaveLength(4);
    listItems.forEach((todo, index) => {
      expect(todo).toHaveTextContent(initialTodos[index].title);
    });

    const firstTodoCheckbox = screen.getAllByRole("checkbox")[0];
    const firstTodo = firstTodoCheckbox.closest("li");

    // First todo's checkbox initially unchecked
    expect(firstTodoCheckbox).not.toBeChecked();
    expect(firstTodo).toHaveTextContent(initialTodos[0].title);

    // Mark first todo as done
    await user.click(firstTodoCheckbox);

    const lastTodoCheckbox =
      screen.getAllByRole("checkbox")[initialTodos.length - 1];
    const lastTodo = lastTodoCheckbox.closest("li");

    // Done todo moved to the bottom of the list
    expect(firstTodoCheckbox).not.toBeChecked();
    expect(firstTodo).not.toHaveTextContent(initialTodos[0].title);
    // Done todo displayed correctly
    expect(lastTodoCheckbox).toBeChecked();
    expect(lastTodo).toHaveTextContent(initialTodos[0].title);

    // Uncheck done todo
    await user.click(lastTodoCheckbox);

    // Unchecked todo still at the bottom of the list, checkbox now unchecked
    expect(lastTodoCheckbox).not.toBeChecked();
    expect(lastTodo).toHaveTextContent(initialTodos[0].title);
  });

  test.todo("edit todo");

  test.todo("move todo up/down the list");
});
