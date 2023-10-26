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

  const getPosts = useQuery<
    AxiosResponse<PostType[]>,
    AxiosError<PostType[]>,
    PostType[]
  >({
    queryKey: ["posts"],
    queryFn: async () =>
      delayAxiosRequest(await axios.get("http://localhost:4000/posts")),
    // Order by descending id (new to old)
    select: (data) => data.data.sort((current, next) => next.id - current.id),
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
    mutationFn: async (post) =>
      delayAxiosRequest(await axios.post("http://localhost:4000/posts", post)),
    // Optimistic update
    onMutate: async (data) => {
      await postQueryClient.cancelQueries({ queryKey: ["posts"] });

      const previousPosts = postQueryClient.getQueryData<
        AxiosResponse<PostType[]>
      >(["posts"]);

      postQueryClient.setQueryData<AxiosResponse<PostType[]>>(
        ["posts"],
        (oldData: AxiosResponse<PostType[]> | undefined) =>
          oldData
            ? {
                ...oldData,
                data: [...oldData.data, data],
              }
            : oldData,
      );

      return () => ({ previousPosts: previousPosts?.data });
    },
    onError: (err, _data, context) => {
      const { previousPosts } = context();
      if (previousPosts)
        postQueryClient.setQueryData<PostType[]>(["posts"], previousPosts);
      console.error(
        `Error while adding new post: ${err?.status} - ${err?.message}`,
      );
    },
    onSettled: () => {
      void postQueryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const onAddRandomPost = useCallback(async () => {
    const newPost = await randomPost;
    addPost.mutate(newPost);
  }, [addPost, randomPost]);

  const editPost = useMutation<PostType, AxiosError<PostType>, PostType>({
    mutationFn: async (post) =>
      delayAxiosRequest(
        await axios.put(`http://localhost:4000/posts/${post.id}`, post),
      ),
    onSuccess: (_data, variables) => {
      // Mutation with no network call
      postQueryClient.setQueryData(
        ["posts"],
        (oldData: AxiosResponse<PostType[]> | undefined) =>
          oldData
            ? {
                ...oldData,
                data: oldData?.data.map((post: PostType) =>
                  post.id === variables.id ? { ...post, ...variables } : post,
                ),
              }
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
    mutationFn: async (post) =>
      delayAxiosRequest(
        await axios.delete(`http://localhost:4000/posts/${post.id}`),
      ),
    onSuccess: () =>
      // Mutation with network call
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
        {getPosts.isLoading && <Typography paragraph>Loading...</Typography>}
        {getPosts.isError &&
          `${getPosts.error.code} ${
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            getPosts.error.response?.status || 500
          }: ${getPosts.error.message}`}
        {getPosts.isSuccess
          ? getPosts.data.map((post) => (
              <Post
                key={post.id}
                post={post}
                onEdit={() => void onEditPost(post.id)}
                onDelete={() => void deletePost.mutate(post)}
                isPending={addPost.isPending}
              />
            ))
          : !(getPosts.isLoading || getPosts.isFetching || getPosts.isError) &&
            "No posts yet."}
      </Stack>
    </Box>
  );
};

export default Posts;
