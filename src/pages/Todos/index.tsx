import { useCallback, useEffect, useMemo, useReducer, useState } from "react";

// Project import
import { useLocalStorage } from "hooks/useLocalStorage";
import { NewTodo } from "./NewTodo";
import { Todo, TodoType } from "./Todo";
import { todosReducer } from "./todosReducer";

// MUI import
import { Box, Stack, Typography } from "@mui/material";

const Todos = () => {
  const [error, setError] = useState<string | null>(null);

  // Set up todo list saving & retrieval in LocalStorage
  const { currentValue: initialTodoList, setValue: setTodos } =
    useLocalStorage<TodoType[]>("todos");

  const [todos, dispatch] = useReducer(todosReducer, initialTodoList ?? []);

  // Update todo list
  useEffect(() => {
    setTodos(todos);
  }, [setTodos, todos]);

  // Add a new todo
  const handleAddTodo = useCallback((title: string) => {
    dispatch({ type: "add", payload: { title: title.trim() } });
  }, []);

  // Edit a todo
  const handleEditTodo = useCallback((editedItem: [string, string]) => {
    const [id, title] = editedItem;
    dispatch({ type: "edit", payload: { id, title } });
  }, []);

  // Delete a todo
  const handleDeleteTodo = useCallback((id: string) => {
    dispatch({ type: "delete", payload: { id } });
  }, []);

  // Check/uncheck a todo
  const handleToggleTodo = useCallback((id: string, done: boolean) => {
    dispatch({ type: "toggle", payload: { id, done } });
  }, []);

  // Move todos up/down the list
  const handleMove = useCallback((moveUp: boolean, id: string) => {
    dispatch({ type: "move", payload: { id, moveUp } });
  }, []);

  // List todos, display done at the bottom of the list
  const todoList = useMemo(
    () =>
      todos.length &&
      todos
        .sort((a, b) => Number(a.done) - Number(b.done))
        .map((todo: TodoType, index: number) => (
          <Todo
            key={index}
            position={[
              index === 0,
              index === todos.filter((todo) => !todo.done).length - 1,
            ]}
            id={todo.id}
            title={todo.title}
            done={todo.done}
            onToggleTodo={() => handleToggleTodo(todo.id, todo.done)}
            onDeleteTodo={() => handleDeleteTodo(todo.id)}
            onEditTodo={handleEditTodo}
            onMove={handleMove}
            onError={setError}
            error={error}
          />
        )),
    [
      error,
      handleDeleteTodo,
      handleEditTodo,
      handleMove,
      handleToggleTodo,
      todos,
    ],
  );

  return (
    <Box m={3}>
      <Typography variant="h2" mb={6}>
        Todo List
      </Typography>

      <NewTodo onAddTodo={handleAddTodo} disabled={!!error} />

      {/* Display the items if available, else display "Your list is empty" */}
      {todos.length ? (
        <Stack component="ul" maxWidth="24rem" spacing={2} useFlexGap p={0}>
          {todoList}
        </Stack>
      ) : (
        <Typography>Your list is empty.</Typography>
      )}
    </Box>
  );
};

export default Todos;
