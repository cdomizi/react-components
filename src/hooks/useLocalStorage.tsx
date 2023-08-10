const useLocalStorage = (key: string, initialValue?: string) => {
  // Set initial value
  if (initialValue) localStorage.setItem(key, JSON.stringify(initialValue));

  // Get function
  const currentValue = localStorage.getItem(key);
  const getValue = currentValue && JSON.parse(currentValue);

  // Set function
  const setValue = (value: string) =>
    localStorage.setItem(key, JSON.stringify(value));

  // Delete function
  const deleteValue = () => localStorage.removeItem(key);

  return [getValue, setValue, deleteValue];
};

export default useLocalStorage;
