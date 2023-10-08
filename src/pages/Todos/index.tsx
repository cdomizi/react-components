import { Box, Button, Stack, TextField, Typography } from "@mui/material";

const Todos = () => {
  return (
    <Box m={3}>
      <Typography variant="h4">Todos</Typography>
      <Stack direction="row" spacing={2} my={3}>
        <TextField id="new-todo" placeholder="New Todo" />
        <Button variant="outlined">Add Todo</Button>
      </Stack>
    </Box>
  );
};

export default Todos;
