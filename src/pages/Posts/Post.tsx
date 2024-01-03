import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { PostType } from "./index";

export const Post = ({
  post,
  onEdit,
  onDelete,
  isPending,
  error,
  onError,
}: {
  post?: PostType;
  onEdit?: () => void;
  onDelete?: () => void;
  isPending?: boolean;
  error?: string;
  onError?: () => void;
}) => {
  return (
    <Card
      raised={true}
      sx={{
        ...(isPending && { opacity: "0.5" }),
        ...(!!error && { borderColor: "red" }),
        width: 270,
        borderRadius: "2%",
      }}
      variant={error ? "outlined" : "elevation"}
    >
      <CardHeader
        title={post?.title ?? ""}
        subheader={
          error ? (
            <Typography color="error">Error: Could not add post</Typography>
          ) : (
            `#${post?.id ?? ""}`
          )
        }
        action={
          error ? (
            <Button
              size="small"
              color="error"
              variant="contained"
              onClick={onError}
            >
              Retry
            </Button>
          ) : (
            <Stack>
              <IconButton size="small" onClick={onEdit}>
                <EditIcon color="primary" />
              </IconButton>
              <IconButton size="small" onClick={onDelete}>
                <DeleteIcon color="error" />
              </IconButton>
            </Stack>
          )
        }
      />
      <CardContent sx={{ ...(error && { opacity: "0.5" }) }}>
        <Typography display="block" paragraph>
          {post?.body ?? ""}
        </Typography>
      </CardContent>
    </Card>
  );
};
