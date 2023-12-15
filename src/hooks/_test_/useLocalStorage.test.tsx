import { renderHook } from "@testing-library/react";
import { useLocalStorage } from "../useLocalStorage";

const STORAGE_KEY = "todos";

const mockGetItem = vi.spyOn(localStorage, "getItem");
const mockSetItem = vi.spyOn(localStorage, "setItem");
const mockRemoveItem = vi.spyOn(localStorage, "removeItem");

afterEach(() => {
  localStorage.clear();
});

describe("useLocalStorage", () => {
  test("no initial value", () => {
    const { result } = renderHook(() => useLocalStorage(STORAGE_KEY));

    expect(result.current.currentValue).toBeNull();
    expect(mockGetItem).toHaveBeenCalledOnce();
    expect(mockGetItem).toHaveBeenCalledWith(STORAGE_KEY);
  });

  test("provide initial value", () => {
    const initialTodo = "test todo";
    const { result } = renderHook(() =>
      useLocalStorage(STORAGE_KEY, initialTodo),
    );

    expect(result.current.currentValue).toBe(initialTodo);
    expect(mockGetItem).toHaveBeenCalledOnce();
    expect(mockGetItem).toHaveBeenCalledWith(STORAGE_KEY);
  });

  test("set new value", () => {
    const initialTodo = "initial todo";
    const newTodo = "new todo";
    const { result } = renderHook(() =>
      useLocalStorage(STORAGE_KEY, initialTodo),
    );
    const { currentValue, setValue } = result.current;

    expect(currentValue).toBe(initialTodo);

    // Change initial value
    setValue(newTodo);

    expect(currentValue).toBe(newTodo);
    expect(mockSetItem).toHaveBeenCalledOnce();
    expect(mockSetItem).toHaveBeenCalledWith(STORAGE_KEY, newTodo);
  });

  test("delete value", () => {
    const initialTodo = "initial todo";
    const { result } = renderHook(() =>
      useLocalStorage(STORAGE_KEY, initialTodo),
    );
    const { currentValue, deleteValue } = result.current;

    expect(currentValue).toBe(initialTodo);

    // Clear value
    deleteValue();

    expect(currentValue).toBeNull();
    expect(mockRemoveItem).toHaveBeenCalledOnce();
    expect(mockRemoveItem).toHaveBeenCalledWith(STORAGE_KEY);
  });
});
