import { useCallback, useMemo } from "react";

export function useLocalStorage<TData>(key: string, initialValue?: TData) {
  // Set initial value
  if (initialValue) localStorage.setItem(key, JSON.stringify({ initialValue }));

  // Get function
  const currentValue = useMemo(() => {
    const currentValue = localStorage.getItem(key);
    return currentValue ? (JSON.parse(currentValue) as TData) : null;
  }, [key]);

  // Set function
  const setValue = useCallback(
    (value: TData) => localStorage.setItem(key, JSON.stringify(value)),
    [key],
  );

  // Delete function
  const deleteValue = useCallback(() => localStorage.removeItem(key), [key]);

  return { currentValue, setValue, deleteValue };
}
