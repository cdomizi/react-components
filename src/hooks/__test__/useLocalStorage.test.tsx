import { renderHook } from "@testing-library/react";
import { useLocalStorage } from "../useLocalStorage";

const STORAGE_KEY = "todos";

afterEach(() => {
  localStorage.clear();
});

describe("useLocalStorage", () => {
  test("no initial value", () => {
    const { result } = renderHook(() => useLocalStorage(STORAGE_KEY));

    expect(result.current.currentValue).toBeNull();
  });

  test("provide initial value", () => {
    const initialValue = localStorage.getItem("todos");

    // Check that the store is empty
    expect(initialValue).toBeNull();

    const initialTodo = "test todo";
    // Initialize the store with an initial value
    const { result } = renderHook(() =>
      useLocalStorage(STORAGE_KEY, initialTodo),
    );

    expect(result.current.currentValue).toBe(initialTodo);
  });

  test("set new value", () => {
    const initialTodo = "initial todo";
    const newTodo = "new todo";

    const { result } = renderHook(() =>
      useLocalStorage(STORAGE_KEY, initialTodo),
    );
    const { currentValue: initialValue, setValue } = result.current;

    expect(initialValue).toBe(initialTodo);

    // Change initial value
    setValue(newTodo);

    const storedValue = localStorage.getItem("todos");
    const newValue =
      storedValue !== null ? (JSON.parse(storedValue) as string) : null;

    expect(newValue).toBe(newTodo);
  });

  test("delete value", () => {
    const initialTodo = "initial todo";
    const { result } = renderHook(() =>
      useLocalStorage(STORAGE_KEY, initialTodo),
    );
    const { currentValue: initialValue, deleteValue } = result.current;

    expect(initialValue).toBe(initialTodo);

    // Clear value
    deleteValue();

    const storedValue = localStorage.getItem("todos");
    const newValue =
      storedValue !== null ? (JSON.parse(storedValue) as string) : null;

    expect(newValue).toBeNull();
  });
});
