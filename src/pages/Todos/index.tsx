import { useReducer, useMemo, useEffect, useCallback } from "react";
import { nanoid } from "nanoid";

// Project import
import { NewTodo } from "./NewTodo";
import { Todo } from "./Todo";
import { TodoType } from "./Todo";
import { useLocalStorage } from "../../hooks/useLocalStorage";

// MUI imoport
import { Box, Stack } from "@mui/material";
import { Typography } from "@mui/material";

const Todos = () => {
  const { currentValue: initialTodoList, setValue: setTodos } =
    useLocalStorage<TodoType[]>("todos");

  const TODO_ACTIONS = useMemo(
    () =>
      ({
        ADD: "add",
        EDIT: "edit",
        DELETE: "delete",
        TOGGLE: "toggle",
        MOVE: "move",
      }) as const,
    [],
  );

  type TodoPayload = {
    id?: string;
    title?: string;
    done?: boolean;
    moveUp?: boolean;
  };

  const todosReducer = useCallback(
    (
      todos: TodoType[],
      action: {
        type: "add" | "edit" | "delete" | "toggle" | "move";
        payload: TodoPayload;
      },
    ) => {
      switch (action.type) {
        case TODO_ACTIONS.ADD: {
          return action.payload?.title
            ? [
                {
                  id: nanoid(12),
                  title: action.payload.title ?? "",
                  done: false,
                },
                ...todos,
              ]
            : todos;
        }
        case TODO_ACTIONS.EDIT: {
          return action.payload?.title
            ? todos.map((todo) =>
                todo.id === action.payload.id
                  ? { ...todo, title: action.payload?.title?.trim() ?? "" }
                  : { ...todo },
              )
            : todos;
        }
        case TODO_ACTIONS.DELETE: {
          return todos.filter((todo) => todo.id !== action.payload.id);
        }
        case TODO_ACTIONS.TOGGLE: {
          return todos.map(
            (todo) =>
              (todo =
                todo.id === action.payload.id
                  ? { ...todo, done: !action.payload.done }
                  : { ...todo }),
          );
        }
        case TODO_ACTIONS.MOVE: {
          const index = todos.findIndex(
            (todo) => todo.id === action.payload.id,
          );
          const newList = [...todos];
          action.payload.moveUp
            ? ([newList[index], newList[index - 1]] = [
                newList[index - 1],
                newList[index],
              ])
            : ([newList[index], newList[index + 1]] = [
                newList[index + 1],
                newList[index],
              ]);
          return newList;
        }
        default: {
          throw new Error("Unknown action");
        }
      }
    },
    [TODO_ACTIONS],
  );

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
          />
        )),
    [handleDeleteTodo, handleEditTodo, handleMove, handleToggleTodo, todos],
  );

  return (
    <Box m={3}>
      <Typography variant="h2" mb={6}>
        Todo List
      </Typography>

      <NewTodo onAddTodo={handleAddTodo} />

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
