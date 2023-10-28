import { useState, useMemo, useEffect, useRef, useCallback } from "react";

// Project import
import { UpDownArrows } from "./UpDownArrows";

// MUI components
import {
  Checkbox,
  IconButton,
  ListItemIcon,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";

// MUI icons
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Done as DoneIcon,
} from "@mui/icons-material";

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
}: PropsType) => {
  const [error, setError] = useState(false);
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(title);
  const inputRef = useRef(null);

  // Update content as the user types
  useEffect(() => setContent(title), [title]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      error && value.length && setError(false);
      setContent(value);
    },
    [error],
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
      setEditing(false);
    } else setError(true);
  }, [content, id, onEditTodo, title]);

  const todo = useMemo(() => {
    return (
      <Stack component="li" direction="row" alignItems="center">
        <ListItemIcon>
          <Checkbox checked={done} onChange={onToggleTodo} />
        </ListItemIcon>
        <TextField
          variant="standard"
          value={content}
          ref={inputRef}
          onChange={handleChange}
          onBlur={handleEdit}
          error={error}
          helperText={error && "This field can't be empty."}
          inputProps={{ readOnly: !editing }}
          sx={{
            "& .MuiInputBase-input": {
              textDecoration: done ? "line-through" : "inherit",
              color: done ? "text.disabled" : "inherit",
            },
          }}
          autoFocus={editing}
          multiline
        />
        {!editing ? (
          <Tooltip title="Edit">
            <IconButton
              aria-label="edit"
              sx={{ ml: "auto" }}
              onClick={() => setEditing(true)}
            >
              <EditIcon color="primary" />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Done">
            <IconButton
              aria-label="done"
              color="success"
              sx={{ ml: "auto" }}
              onClick={() => setEditing(false)}
            >
              <DoneIcon />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title="Delete">
          <IconButton href="#" aria-label="delete" onClick={onDeleteTodo}>
            <DeleteIcon color="error" />
          </IconButton>
        </Tooltip>
        <UpDownArrows position={position} moveUp={handleMove} disabled={done} />
      </Stack>
    );
  }, [
    done,
    onToggleTodo,
    content,
    handleChange,
    handleEdit,
    error,
    editing,
    onDeleteTodo,
    position,
    handleMove,
  ]);

  return todo;
};
