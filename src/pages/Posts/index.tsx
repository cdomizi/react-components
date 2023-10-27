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

const Posts = () => {
  const postQueryClient = useQueryClient();

  const getPosts = useQuery<PostType[], AxiosError<PostType[]>, PostType[]>({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await delayAxiosRequest<AxiosResponse<PostType[]>>(
        await axios.get("http://localhost:4000/posts"),
      );
      return res?.data;
    },
    // Order by descending id (new to old)
    select: (post) => post.sort((current, next) => next.id - current.id),
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
      id: getPosts.isSuccess ? getPosts.data?.length + 1 : 1,
      title,
      body: formatBody,
    };

    return randomPost;
  }, [getPosts.data, getPosts.isSuccess]);

  const addPost = useMutation<PostType, AxiosError<PostType>, PostType>({
    mutationFn: async (post) => {
      const res = await delayAxiosRequest<AxiosResponse<PostType>>(
        await axios.post("http://localhost:4000/posts", post),
      );
      return res?.data;
    },
    // Optimistic update
    onMutate: async (posts) => {
      await postQueryClient.cancelQueries({ queryKey: ["posts"] });

      const previousPosts = postQueryClient.getQueryData<PostType[]>(["posts"]);

      postQueryClient.setQueryData<PostType[]>(
        ["posts"],
        (oldPosts: PostType[] | undefined) =>
          oldPosts ? [...oldPosts, posts] : oldPosts,
      );

      return { previousPosts };
    },
    onError: (err, _variables, context) => {
      // Type assertion only needed if TS not inferring `context` type correctly
      const { previousPosts } = context as {
        previousPosts: PostType[] | undefined;
      };
      if (previousPosts)
        postQueryClient.setQueryData<PostType[]>(["posts"], previousPosts);
      console.error(`Error while adding new post: ${err?.message}`);
    },
    onSettled: async () =>
      await postQueryClient.invalidateQueries({ queryKey: ["posts"] }),
  });

  const onAddRandomPost = useCallback(async () => {
    const newPost = await randomPost;
    addPost.mutate(newPost);
  }, [addPost, randomPost]);

  const editPost = useMutation<PostType, AxiosError<PostType>, PostType>({
    mutationFn: async (post) => {
      const res = await delayAxiosRequest<AxiosResponse<PostType>>(
        await axios.put(`http://localhost:4000/posts/${post.id}`, post),
      );
      return res?.data;
    },
    onSuccess: (editedPost) => {
      // Mutation with no network call
      postQueryClient.setQueryData(
        ["posts"],
        (oldData: PostType[] | undefined) =>
          oldData
            ? oldData?.map((post: PostType) =>
                post.id === editedPost.id ? { ...post, ...editedPost } : post,
              )
            : oldData,
      );
    },
  });

  const onEditPost = useCallback(
    async (id: number) => {
      const newPost = await randomPost;
      editPost.mutate({ ...newPost, id });
    },
    [editPost, randomPost],
  );

  const deletePost = useMutation<PostType, AxiosError<PostType>, PostType>({
    mutationFn: async (post) => {
      const res = await delayAxiosRequest<AxiosResponse<PostType>>(
        await axios.delete(`http://localhost:4000/posts/${post.id}`),
      );
      return res?.data;
    },
    onSuccess: async () =>
      // Mutation with network call
      await postQueryClient.invalidateQueries({ queryKey: ["posts"] }),
  });

  return (
    <Box m={3}>
      <Typography variant="h2" mb={6}>
        Posts
      </Typography>
      <Button variant="outlined" size="small" onClick={onAddRandomPost}>
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
        {getPosts.isLoading && <Typography paragraph>Loading...</Typography>}
        {getPosts.isError &&
          `${getPosts.error.code} ${
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            getPosts.error.response?.status || 500
          }: ${getPosts.error.message}`}
        {getPosts.isSuccess &&
          (getPosts.data?.length
            ? getPosts.data.map((post) => (
                <Post
                  key={post.id}
                  post={post}
                  onEdit={() => onEditPost(post.id)}
                  onDelete={() => deletePost.mutate(post)}
                  isPending={
                    addPost.isPending && addPost.variables.id === post.id
                  }
                />
              ))
            : !(
                getPosts.isLoading ||
                getPosts.isFetching ||
                getPosts.isError
              ) && "No posts yet.")}
      </Stack>
    </Box>
  );
};

export default Posts;
