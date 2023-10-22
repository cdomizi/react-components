import { useState, useMemo, useEffect, useRef, useCallback } from "react";

// Project import
import { UpDownArrows } from "./UpDownArrows";

// MUI components
import {
  Checkbox,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
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
  complete: boolean;
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
  complete,
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
      <>
        {!editing ? (
          <>
            <ListItemText
              primary={title}
              sx={{
                maxWidth: "13.5rem",
                textDecoration: complete ? "line-through" : "inherit",
                color: complete ? "text.disabled" : "inherit",
              }}
            />
            <Tooltip title="Edit">
              <IconButton
                aria-label="edit"
                sx={{ ml: 2 }}
                onClick={() => setEditing(true)}
              >
                <EditIcon color="primary" />
              </IconButton>
            </Tooltip>
          </>
        ) : (
          <>
            <TextField
              variant="standard"
              value={content}
              ref={inputRef}
              onChange={handleChange}
              onBlur={handleEdit}
              error={error}
              helperText={error && "This field can't be empty."}
              autoFocus
            />
            <Tooltip title="Done">
              <IconButton aria-label="done" color="success" sx={{ ml: 2 }}>
                <DoneIcon />
              </IconButton>
            </Tooltip>
          </>
        )}
      </>
    );
  }, [editing, title, complete, content, handleChange, handleEdit, error]);

  return (
    <ListItem>
      <ListItemIcon>
        <Checkbox checked={complete} onChange={onToggleTodo} />
      </ListItemIcon>
      {todo}
      <Tooltip title="Delete">
        <IconButton href="#" aria-label="delete" onClick={onDeleteTodo}>
          <DeleteIcon color="error" />
        </IconButton>
      </Tooltip>
      <UpDownArrows
        position={position}
        moveUp={handleMove}
        disabled={complete}
      />
    </ListItem>
  );
};
