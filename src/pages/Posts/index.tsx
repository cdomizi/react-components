import { useCallback, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";

// Project import
import getRandomData from "../../utils/getRandomData";
import { delayAxiosRequest } from "../../utils/delay";
import { Post } from "./Post";

// MUI components
import { Box, Button, capitalize, Stack, Typography } from "@mui/material";

export type PostType = {
  id: number;
  title: string;
  body: string;
};

type PostQuery = {
  method?: "GET" | "POST";
  data: PostType[];
};

const Posts = () => {
  const postQueryClient = useQueryClient();

  const queryParams = useMemo(() => "?_sort=id&_order=desc", []);

  const getPost = async (): Promise<PostQuery> =>
    // Artificially delay function to show loading state
    delayAxiosRequest(
      await axios.get(`http://localhost:3500/posts${queryParams}`),
    );

  const postQuery = useQuery<PostQuery, AxiosError<PostType>>({
    queryKey: ["posts"],
    queryFn: getPost,
  });

  const randomPost = useMemo(async (): Promise<PostType> => {
    const { body } = await getRandomData<PostType>(
      "https://dummyjson.com/posts",
    );
    const title =
      capitalize(body.split(" ")[19]) +
      " " +
      body.split(" ").slice(20, 26).join(" ");
    const formatBody =
      capitalize(body.split(" ")[29]) +
      " " +
      body.split(" ").slice(30, 56).join(" ") +
      ".";
    const randomPost = {
      id: postQuery.isSuccess ? postQuery.data.data?.length + 1 : 1,
      title,
      body: formatBody,
    };

    return randomPost;
  }, [postQuery.data, postQuery.isSuccess]);

  const addPost = useMutation<
    AxiosResponse<PostType>,
    AxiosError<PostType>,
    PostType,
    unknown
  >({
    mutationFn: async (post) =>
      delayAxiosRequest(await axios.post("http://localhost:3500/posts", post)),
    onSuccess: () =>
      void postQueryClient.invalidateQueries({ queryKey: ["posts"] }),
  });

  const onAddRandomPost = useCallback(async () => {
    const newPost = await randomPost;
    addPost.mutate(newPost);
  }, [addPost, randomPost]);

  const deletePost = useMutation<
    AxiosResponse<PostType>,
    AxiosError<PostType>,
    number,
    unknown
  >({
    mutationFn: async (id: number) => {
      return await axios.delete(`http://localhost:3500/posts/${id}`);
    },
    onSuccess: () =>
      void postQueryClient.invalidateQueries({ queryKey: ["posts"] }),
  });

  return (
    <Box m={3}>
      <Typography variant="h2" mb={6}>
        Posts
      </Typography>
      <Button
        variant="outlined"
        size="small"
        onClick={() => void onAddRandomPost()}
      >
        Add random post
      </Button>
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
              <Post
                key={post.id}
                post={post}
                onDelete={() => void deletePost.mutate(post.id)}
              />
            ))
          : !(
              postQuery.isLoading ||
              postQuery.isFetching ||
              postQuery.isError
            ) && "No posts yet."}
      </Stack>
    </Box>
  );
};

export default Posts;
