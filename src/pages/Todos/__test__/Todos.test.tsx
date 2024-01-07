import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Todos from "..";

const setInitialTodos = (todos: string) => {
  localStorage.setItem("todos", todos);
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
    const user = userEvent.setup();

    const initialTodos = [
      { id: "UsXKZeUBML3s", title: "initial todo", done: false },
    ];
    setInitialTodos(JSON.stringify(initialTodos));
    const newTodoTitle = "New todo";

    render(<Todos />);

    const todoList = screen.getByRole("list");
    const initialListItems = screen.getAllByRole("listitem");
    const firstTodo = initialListItems[0];
    const firstTodoDoneCheckbox = screen.getByRole("checkbox");
    const firstTodoDeleteButton = screen.getByRole("link", { name: "delete" });
    const firstTodoMoveUpArrow = screen.getByTestId(/ArrowDropUpIcon/i);
    const firstTodoMoveDownArrow = screen.getByTestId(/ArrowDropDownIcon/i);

    // Todos list initially contains one item
    expect(todoList).toBeInTheDocument();
    expect(initialListItems).toHaveLength(1);
    expect(firstTodo).toBeInTheDocument();
    expect(firstTodo).toHaveTextContent(initialTodos[0].title);
    expect(firstTodoDoneCheckbox).toBeInTheDocument();
    // Checkbox unchecked by default
    expect(firstTodoDoneCheckbox).not.toBeChecked();
    expect(firstTodoDeleteButton).toBeInTheDocument();
    // Move up/down arrows buth disabled, as the list only contains one element
    expect(firstTodoMoveUpArrow.parentElement).toHaveClass("Mui-disabled");
    expect(firstTodoMoveDownArrow.parentElement).toHaveClass("Mui-disabled");

    const addButton = screen.getByRole("button", { name: /add/i });

    expect(addButton).toBeInTheDocument();

    // Add empty todo
    await user.click(addButton);

    const addTodo = screen.getAllByRole("textbox")[0];

    // New todo field displays error
    expect(addTodo.parentElement).toHaveClass("Mui-error");

    // Add new todo
    await user.type(addTodo, newTodoTitle);
    await user.click(addButton);

    const newListItems = screen.getAllByRole("listitem");
    const secondTodo = newListItems[1];
    const moveUpArrows = screen.getAllByTestId(/ArrowDropUpIcon/i);
    const moveDownArrows = screen.getAllByTestId(/ArrowDropDownIcon/i);

    // New todo appears first in the list
    expect(newListItems).toHaveLength(2);
    expect(firstTodo).toHaveTextContent(newTodoTitle);
    expect(secondTodo).toBeInTheDocument();
    expect(secondTodo).toHaveTextContent(initialTodos[0].title);
    // External move up/down arrows disabled, internal enabled
    expect(moveUpArrows[0].parentElement).toHaveClass("Mui-disabled");
    expect(moveUpArrows[1].parentElement).not.toHaveClass("Mui-disabled");
    expect(moveDownArrows[0].parentElement).not.toHaveClass("Mui-disabled");
    expect(moveDownArrows[1].parentElement).toHaveClass("Mui-disabled");

    // Delete todo
    await user.click(firstTodoDeleteButton);

    const finalListItems = screen.getAllByRole("listitem");
    const finalFirstTodo = finalListItems[0];

    // New todo correctly deleted from the list
    expect(finalListItems).toHaveLength(1);
    expect(finalFirstTodo).toBeInTheDocument();
    expect(finalFirstTodo).toHaveTextContent(initialTodos[0].title);
    expect(() => screen.getByText(newTodoTitle)).toThrow();
  });

  test("check and uncheck todo", async () => {
    const user = userEvent.setup();

    const initialTodos = [
      { id: "UsXKZeUBML3s", title: "first", done: false },
      { id: "ZznrF4j0KOhe", title: "second", done: false },
      { id: "oaPE6xV6fBFX", title: "third", done: false },
      { id: "63ThxbhB5fRA", title: "fourth", done: false },
    ];
    setInitialTodos(JSON.stringify(initialTodos));

    render(<Todos />);

    const initialTodoList = screen.getByRole("list");
    const listItems = screen.getAllByRole("listitem");
    const todoCheckboxes = screen.getAllByRole("checkbox");
    const moveUpArrows = screen.getAllByTestId(/ArrowDropUpIcon/i);
    const moveDownArrows = screen.getAllByTestId(/ArrowDropDownIcon/i);

    // Initial todo list renders correctly
    expect(initialTodoList).toBeInTheDocument();
    expect(listItems).toHaveLength(4);
    listItems.forEach((todo, index) => {
      expect(todo).toHaveTextContent(initialTodos[index].title);
    });
    todoCheckboxes.forEach((checkBox) => {
      expect(checkBox).not.toBeChecked();
    });
    // Move up/down arrows all enabled except first and last todos
    moveUpArrows.forEach((arrow, index) => {
      if (index === 0) expect(arrow.parentElement).toHaveClass("Mui-disabled");
      else expect(arrow.parentElement).not.toHaveClass("Mui-disabled");
    });
    moveDownArrows.forEach((arrow, index) => {
      if (index === moveDownArrows.length - 1)
        expect(arrow.parentElement).toHaveClass("Mui-disabled");
      else expect(arrow.parentElement).not.toHaveClass("Mui-disabled");
    });

    // Mark first todo as done
    await user.click(todoCheckboxes[0]);

    const newTodos = screen.getAllByRole("listitem");
    const newFirstTodo = newTodos[0];
    const newLastTodo = newTodos[newTodos.length - 1];
    const newTodoCheckboxes = screen.getAllByRole("checkbox");
    const newMoveUpArrows = screen.getAllByTestId(/ArrowDropUpIcon/i);
    const newMoveDownArrows = screen.getAllByTestId(/ArrowDropDownIcon/i);

    // Done todo moved to the bottom of the list
    expect(newTodoCheckboxes[0]).not.toBeChecked();
    expect(newFirstTodo).not.toHaveTextContent(initialTodos[0].title);
    expect(newFirstTodo).toHaveTextContent(initialTodos[1].title);
    // Done todo displayed correctly
    expect(newTodoCheckboxes[newTodoCheckboxes.length - 1]).toBeChecked();
    expect(newLastTodo).not.toHaveTextContent(initialTodos[3].title);
    expect(newLastTodo).toHaveTextContent(initialTodos[0].title);
    // Move up/down arrows disabled for done todos
    newMoveUpArrows.forEach((arrow, index) => {
      if (index === 0 || index === moveUpArrows.length - 1)
        expect(arrow.parentElement).toHaveClass("Mui-disabled");
      else expect(arrow.parentElement).not.toHaveClass("Mui-disabled");
    });
    newMoveDownArrows.forEach((arrow, index) => {
      if (
        index === moveDownArrows.length - 1 ||
        index === moveDownArrows.length - 2
      )
        expect(arrow.parentElement).toHaveClass("Mui-disabled");
      else expect(arrow.parentElement).not.toHaveClass("Mui-disabled");
    });

    // Uncheck done todo
    await user.click(newTodoCheckboxes[newTodoCheckboxes.length - 1]);

    const finalTodos = screen.getAllByRole("listitem");
    const finalTodoCheckboxes = screen.getAllByRole("checkbox");
    const finalMoveUpArrows = screen.getAllByTestId(/ArrowDropUpIcon/i);
    const finalMoveDownArrows = screen.getAllByTestId(/ArrowDropDownIcon/i);

    // Unchecked todo still at the bottom of the list, checkbox now unchecked
    expect(finalTodoCheckboxes[todoCheckboxes.length - 1]).not.toBeChecked();
    expect(finalTodos[finalTodos.length - 1]).toHaveTextContent(
      initialTodos[0].title,
    );
    // Move up/down arrows back as default for last item of the list
    expect(
      finalMoveUpArrows[finalMoveUpArrows.length - 1].parentElement,
    ).not.toHaveClass("Mui-disabled");
    expect(
      finalMoveDownArrows[finalMoveDownArrows.length - 1].parentElement,
    ).toHaveClass("Mui-disabled");
  });

  test("edit todo", async () => {
    const user = userEvent.setup();

    const initialTodos = [
      { id: "UsXKZeUBML3s", title: "first", done: false },
      { id: "ZznrF4j0KOhe", title: "second", done: false },
      { id: "oaPE6xV6fBFX", title: "third", done: false },
      { id: "63ThxbhB5fRA", title: "fourth", done: true },
    ];
    setInitialTodos(JSON.stringify(initialTodos));
    const newTitle = "new title";

    render(<Todos />);

    const firstTodoTitle = screen.getAllByRole("textbox")[1];

    // First todo showing initial title
    expect(firstTodoTitle).toHaveTextContent(initialTodos[0].title);

    // Edit first todo title
    await user.clear(firstTodoTitle);
    await user.type(firstTodoTitle, newTitle);

    // First todo has edited title
    expect(firstTodoTitle).toHaveTextContent(newTitle);

    // Edit done todo
    const doneTodoTitle = screen.getAllByRole("textbox")[4];

    // Done todo showing initial title
    expect(doneTodoTitle).toHaveTextContent(initialTodos[3].title);

    // Edit done todo title
    await user.clear(doneTodoTitle);
    await user.type(doneTodoTitle, newTitle);

    // Done todo has edited title
    expect(doneTodoTitle).toHaveTextContent(newTitle);
  });

  test("move todo up/down the list", async () => {
    const user = userEvent.setup();

    const initialTodos = [
      { id: "UsXKZeUBML3s", title: "first", done: false },
      { id: "ZznrF4j0KOhe", title: "second", done: false },
      { id: "oaPE6xV6fBFX", title: "third", done: false },
      { id: "63ThxbhB5fRA", title: "fourth", done: false },
    ];
    setInitialTodos(JSON.stringify(initialTodos));

    render(<Todos />);

    const initialTodoList = screen.getAllByRole("listitem");
    const moveUpArrows = screen.getAllByTestId(/ArrowDropUpIcon/i);
    const moveDownArrows = screen.getAllByTestId(/ArrowDropDownIcon/i);

    // Initial todo list displayed correctly
    expect(initialTodoList).toHaveLength(4);
    initialTodoList.forEach((todo, index) => {
      expect(todo).toHaveTextContent(initialTodos[index].title);
    });

    // Move first element down one position
    await user.click(moveDownArrows[0]);

    const newTodoList = screen.getAllByRole("listitem");

    // First two elements swapped in the list
    expect(newTodoList).toHaveLength(4);
    expect(newTodoList[0]).toHaveTextContent(initialTodos[1].title);
    expect(newTodoList[1]).toHaveTextContent(initialTodos[0].title);
    // Rest of the list stays the same
    newTodoList.forEach((todo, index) => {
      if (index > 1) expect(todo).toHaveTextContent(initialTodos[index].title);
    });

    // Move second element up one position
    await user.click(moveUpArrows[1]);

    const finalTodoList = screen.getAllByRole("listitem");

    // First two elements swapped back to default positions
    expect(finalTodoList).toHaveLength(4);
    newTodoList.forEach((todo, index) => {
      expect(todo).toHaveTextContent(initialTodos[index].title);
    });
  });
});
