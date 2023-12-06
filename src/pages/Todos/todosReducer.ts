import { nanoid } from "nanoid";
import { TodoType } from "./Todo";

type TodoPayload = {
  id?: string;
  title?: string;
  done?: boolean;
  moveUp?: boolean;
};

const TODO_ACTIONS = {
  ADD: "add",
  EDIT: "edit",
  DELETE: "delete",
  TOGGLE: "toggle",
  MOVE: "move",
};

export const todosReducer = (
  todos: TodoType[],
  action: {
    type: "add" | "edit" | "delete" | "toggle" | "move";
    payload: TodoPayload;
  },
) => {
  switch (action.type) {
    // Add todo
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
    // Edit todo
    case TODO_ACTIONS.EDIT: {
      return action.payload?.title
        ? todos.map((todo) =>
            todo.id === action.payload.id
              ? { ...todo, title: action.payload?.title?.trim() ?? "" }
              : { ...todo },
          )
        : todos;
    }
    // Delete todo
    case TODO_ACTIONS.DELETE: {
      return todos.filter((todo) => todo.id !== action.payload.id);
    }
    // Toggle done todo
    case TODO_ACTIONS.TOGGLE: {
      return todos.map(
        (todo) =>
          (todo =
            todo.id === action.payload.id
              ? { ...todo, done: !action.payload.done }
              : { ...todo }),
      );
    }
    // Move todo up/down
    case TODO_ACTIONS.MOVE: {
      const index = todos.findIndex((todo) => todo.id === action.payload.id);
      const newList = [...todos];
      // Move up if `moveUp` payload value is `true`, else move down
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
};
