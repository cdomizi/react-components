import { PostType } from "./index";
import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";

export const Post = ({
  post,
  onEdit,
  onDelete,
  isPending,
}: {
  post: PostType;
  onEdit: () => void;
  onDelete: () => void;
  isPending: boolean;
}) => {
  return (
    <Card
      raised={true}
      sx={{
        ...(isPending && { opacity: "0.5" }),
        width: 270,
        borderRadius: "2%",
      }}
    >
      <CardHeader
        title={post.title}
        subheader={`#${post.id}`}
        action={
          <Stack>
            <IconButton size="small" onClick={() => onEdit()}>
              <EditIcon color="primary" />
            </IconButton>
            <IconButton size="small" onClick={() => onDelete()}>
              <DeleteIcon color="error" />
            </IconButton>
          </Stack>
        }
      />
      <CardContent>
        <Typography display="block" paragraph>
          {post.body}
        </Typography>
      </CardContent>
    </Card>
  );
};
