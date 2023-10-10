import { PostType } from ".";
import { Card, CardContent, Typography } from "@mui/material";

const Post = ({ post }: { post: PostType }) => {
  return (
    <Card raised={true} sx={{ width: 270, borderRadius: "2%" }}>
      <CardContent>
        <Typography
          variant="button"
          color="text.secondary"
          display="block"
          gutterBottom
        >
          #{post.id}
        </Typography>
        <Typography variant="h4" display="block" paragraph>
          {post.title}
        </Typography>
        <Typography display="block" paragraph>
          {post.body}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Post;
