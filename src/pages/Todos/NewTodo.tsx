import { useCallback, useState } from "react";

import { Box, Button, TextField } from "@mui/material";

const NewTodo = ({ onAddTodo }: { onAddTodo: (title: string) => void }) => {
  const [title, setTitle] = useState("");
  const [error, setError] = useState(false);

  // Add todo only if not empty
  const handleSubmit = useCallback(() => {
    if (title.length) {
      setError(false);
      onAddTodo(title);
      setTitle("");
    } else setError(true);
  }, [onAddTodo, title]);

  return (
    <Box my={3}>
      <TextField
        placeholder="New todo"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={error}
        helperText={error && "This field can't be empty."}
      />
      <Button variant="outlined" sx={{ margin: "12px" }} onClick={handleSubmit}>
        Add
      </Button>
    </Box>
  );
};

export default NewTodo;
