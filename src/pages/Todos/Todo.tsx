import { useState, useMemo, useEffect, useCallback } from "react";
import { UpDownArrows } from "./UpDownArrows";

// MUI components & icons
import {
  Checkbox,
  IconButton,
  ListItemIcon,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";

export type TodoType = {
  id: string;
  title: string;
  done: boolean;
};

type PropsType = TodoType & {
  position: [boolean, boolean];
  onToggleTodo: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => void;
  onDeleteTodo: React.MouseEventHandler<HTMLAnchorElement>;
  onEditTodo: (todo: [string, string]) => void;
  onMove: (moveUp: boolean, id: string) => void;
  onError: (id: string | null) => void;
  error: string | null;
};

export const Todo = ({
  id,
  position,
  title,
  done,
  onToggleTodo,
  onDeleteTodo,
  onEditTodo,
  onMove,
  onError,
  error = null,
}: PropsType) => {
  const [content, setContent] = useState(title);

  // Update content as the user types
  useEffect(() => setContent(title), [title]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      value.length && onError(null);
      setContent(value);
    },
    [onError],
  );

  // Handle moving todo up/down
  const handleMove = useCallback(
    (direction: boolean) => onMove(direction, id),
    [id, onMove],
  );

  // Edit todo only if not empty, else keep previous content
  const handleEdit = useCallback(() => {
    if (content.length) {
      onEditTodo([id, content]);
      setContent(title);
    } else onError(id);
  }, [content, id, onEditTodo, onError, title]);

  const todo = useMemo(() => {
    return (
      <Stack component="li" direction="row" alignItems="center">
        <ListItemIcon>
          <Checkbox checked={done} onChange={onToggleTodo} disabled={!!error} />
        </ListItemIcon>
        <TextField
          variant="outlined"
          value={content}
          onChange={handleChange}
          onBlur={handleEdit}
          error={error === id}
          helperText={error === id && "This field can't be empty."}
          sx={{
            "& .MuiInputBase-input": {
              textDecoration: done ? "line-through" : "inherit",
              color: done ? "text.disabled" : "inherit",
            },
          }}
          multiline
        />
        <Tooltip title="Delete">
          <IconButton
            href="#"
            aria-label="delete"
            onClick={onDeleteTodo}
            disabled={!!error}
          >
            <DeleteIcon color={error ? "disabled" : "error"} />
          </IconButton>
        </Tooltip>
        <UpDownArrows
          position={position}
          moveUp={handleMove}
          disabled={done || !!error}
        />
      </Stack>
    );
  }, [
    done,
    onToggleTodo,
    content,
    handleChange,
    handleEdit,
    error,
    id,
    onDeleteTodo,
    position,
    handleMove,
  ]);

  return todo;
};
