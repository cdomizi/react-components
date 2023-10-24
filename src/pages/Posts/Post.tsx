import { PostType } from "./index";
import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";

export const Post = ({
  post,
  onDelete,
}: {
  post: PostType;
  onDelete: () => void;
}) => {
  return (
    <Card raised={true} sx={{ width: 270, borderRadius: "2%" }}>
      <CardHeader
        title={post.title}
        subheader={`#${post.id}`}
        action={
          <IconButton size="small" onClick={() => onDelete()}>
            <DeleteIcon color="error" />
          </IconButton>
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
