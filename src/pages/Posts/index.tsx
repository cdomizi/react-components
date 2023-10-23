import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

import getRandomData from "../../utils/getRandomData";
import { delayAxiosRequest } from "../../utils/delay";
import { Post } from "./Post";
import { Logger } from "../../components/Logger";

import {
  Box,
  Button,
  capitalize,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

export type Post = {
  id: number;
  title: string;
  body: string;
};

type PostQuery = {
  method?: "GET" | "POST";
  data: Post[];
};

const Posts = () => {
  const [randomPost, setRandomPost] = useState<Post | null>(null);

  const getPost = async (): Promise<PostQuery> =>
    // Artificially delay function to show loading state
    delayAxiosRequest(await axios.get("http://localhost:3500/posts"));

  const postQuery = useQuery<PostQuery, AxiosError<Post>>({
    queryKey: ["posts"],
    queryFn: getPost,
  });

  const getRandomPost = useCallback(async () => {
    const { body } = await getRandomData<Post>("https://dummyjson.com/posts");
    const title =
      capitalize(body.split(" ")[19]) +
      " " +
      body.split(" ").slice(20, 26).join(" ");
    const formatBody =
      capitalize(body.split(" ")[29]) +
      " " +
      body.split(" ").slice(30, 47).join(" ") +
      ".";
    const randomPost = {
      id: postQuery.isSuccess ? postQuery.data.data?.length + 1 : 1,
      title,
      body: formatBody,
    };

    setRandomPost(randomPost);
  }, [postQuery.data, postQuery.isSuccess]);

  return (
    <Box m={3}>
      <Typography variant="h2" mb={6}>
        Posts
      </Typography>
      <Button
        variant="outlined"
        size="small"
        onClick={() => void getRandomPost()}
      >
        Get random post
      </Button>
      <Logger value={randomPost} />
      <Divider />
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={5}
        justifyContent="center"
        useFlexGap
        mt={4}
        sx={{ flexWrap: { xs: "nowrap", sm: "wrap" } }}
      >
        {postQuery.isLoading && <Typography paragraph>Loading...</Typography>}
        {postQuery.isError &&
          `${postQuery.error.code} ${
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            postQuery.error.response?.status || 500
          }: ${postQuery.error.message}`}
        {postQuery.isSuccess
          ? postQuery.data.data.map((post) => (
              <Post key={post.id} post={post} />
            ))
          : !(postQuery.isLoading || postQuery.isFetching) && "No posts yet."}
      </Stack>
    </Box>
  );
};

export default Posts;
