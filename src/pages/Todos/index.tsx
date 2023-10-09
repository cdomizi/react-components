import { useReducer, useMemo, useEffect, useCallback } from "react";
import { nanoid } from "nanoid";

// Project import
import NewTodo from "./NewTodo";
import Todo from "./Todo";
import { TodoType } from "./Todo";

// MUI imoport
import { Box } from "@mui/material";
import { Typography } from "@mui/material";

const Todos = () => {
  // Get list from localStorage
  const initialTodos = useMemo<TodoType[]>(() => {
    const existingTodos = localStorage.getItem("todos");
    return (JSON.parse(existingTodos ?? "[]") as TodoType[]) ?? [];
  }, []);

  const TODOS_ACTIONS = useMemo(
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
    complete?: boolean;
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
        case TODOS_ACTIONS.ADD: {
          return action.payload?.title
            ? [
                {
                  id: nanoid(12),
                  title: action.payload.title ?? "",
                  complete: false,
                },
                ...todos,
              ]
            : todos;
        }
        case TODOS_ACTIONS.EDIT: {
          return action.payload?.title
            ? todos.map((todo) =>
                todo.id === action.payload.id
                  ? { ...todo, title: action.payload?.title?.trim() ?? "" }
                  : { ...todo },
              )
            : todos;
        }
        case TODOS_ACTIONS.DELETE: {
          return todos.filter((todo) => todo.id !== action.payload.id);
        }
        case TODOS_ACTIONS.TOGGLE: {
          return todos.map(
            (todo) =>
              (todo =
                todo.id === action.payload.id
                  ? { ...todo, complete: !action.payload.complete }
                  : { ...todo }),
          );
        }
        case TODOS_ACTIONS.MOVE: {
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
    [TODOS_ACTIONS],
  );

  const [todos, dispatch] = useReducer(todosReducer, initialTodos);

  // Update list in localStorage
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

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
  const handleToggleTodo = useCallback((id: string, complete: boolean) => {
    dispatch({ type: "toggle", payload: { id, complete } });
  }, []);

  // Move todos up/down the list
  const handleMove = useCallback((moveUp: boolean, id: string) => {
    dispatch({ type: "move", payload: { id, moveUp } });
  }, []);

  // List todos, display complete at the bottom of the list
  const todoList = useMemo(
    () =>
      todos
        .sort((a, b) => Number(a.complete) - Number(b.complete))
        .map((todo: TodoType, index: number) => (
          <Todo
            key={index}
            position={[
              index === 0,
              index === todos.filter((todo) => !todo.complete).length - 1,
            ]}
            id={todo.id}
            title={todo.title}
            complete={todo.complete}
            onToggleTodo={() => handleToggleTodo(todo.id, todo.complete)}
            onDeleteTodo={() => handleDeleteTodo(todo.id)}
            onEditTodo={handleEditTodo}
            onMove={handleMove}
          />
        )),
    [handleDeleteTodo, handleEditTodo, handleMove, handleToggleTodo, todos],
  );

  return (
    <Box sx={{ padding: "0px 12px" }}>
      <Typography variant="h2" mb={6}>
        Todo List
      </Typography>

      <NewTodo onAddTodo={handleAddTodo} />

      {todos.length ? todoList : <Typography>Your list is empty.</Typography>}
    </Box>
  );
};

export default Todos;
