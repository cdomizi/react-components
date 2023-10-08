import TodoItem from "./TodoItem";

import { Box, Button, Stack, TextField, Typography } from "@mui/material";

const todos = [
  { id: 1, title: "hello1", complete: false },
  { id: 2, title: "hello2", complete: true },
  { id: 3, title: "hello3", complete: false },
];

export type TodoType = (typeof todos)[number];

const Todos = () => {
  return (
    <Box m={3}>
      <Typography variant="h4">Todos</Typography>
      <Stack direction="row" spacing={2} my={3}>
        <TextField id="new-todo" placeholder="New Todo" />
        <Button variant="outlined">Add Todo</Button>
      </Stack>
      <Stack>
        {todos.map((todo) => (
          <TodoItem key={todo.id} value={todo} />
        ))}
      </Stack>
    </Box>
  );
};

export default Todos;
