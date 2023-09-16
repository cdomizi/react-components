const useLocalStorage = (key: string, initialValue?: string) => {
  // Set initial value
  if (initialValue) localStorage.setItem(key, JSON.stringify(initialValue));

  // Get function
  const getValue = localStorage.getItem(key);

  // Set function
  const setValue = ({
    value,
    expiration = null,
  }: {
    value: string;
    expiration: number | null;
  }) => localStorage.setItem(key, JSON.stringify({ value, expiration }));

  // Delete function
  const deleteValue = () => localStorage.removeItem(key);

  return [getValue, setValue, deleteValue];
};

export default useLocalStorage;
