import { QueryClient } from "@tanstack/react-query";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios, { AxiosResponse } from "axios";
import { allPosts, newPost, randomPost } from "mocks/data";
import { renderWithClient } from "pages/Fetch/__test__/TanstackQuery.test";
import * as delayUtils from "utils/delayUtils";
import Posts from "..";

beforeEach(() => {
  // Mock response artificial delay
  vi.spyOn(delayUtils, "delayAxiosRequest").mockImplementation(
    async (value: unknown) =>
      new Promise((resolve) => {
        setTimeout(() => resolve(value), 50);
      }),
  );
});

describe("Posts", () => {
  test("component renders correctly", async () => {
    renderWithClient(
      new QueryClient({ defaultOptions: { queries: { retry: false } } }),
      <Posts />,
    );

    const heading = screen.getByText(/posts/i);
    const newPostButton = screen.getByRole("button", {
      name: /^add random post$/i,
    });
    const postList = screen.getByRole("list");
    const loadingText = screen.getByText(/loading/i);

    expect(heading).toBeInTheDocument();
    expect(newPostButton).toBeInTheDocument();
    expect(postList).toBeInTheDocument();
    expect(loadingText).toBeInTheDocument();

    await waitFor(() => {
      const posts = screen.getAllByRole("listitem");

      // Loading complete
      expect(loadingText).not.toBeInTheDocument();
      // All existing posts are displayed with the appropriate buttons
      expect(posts).toHaveLength(allPosts.length);
      posts.forEach((post) => {
        const postId = within(post)
          .getByText(/^#\d+$/i)
          .textContent?.slice(1);
        const postTitle = within(post).getByRole("heading");
        const postBody = within(post).getByTestId(/^post-body-\d+/i);
        const postEditButton = within(post).getByTestId(/^edit-button-\d+$/i);
        const postDeleteButton =
          within(post).getByTestId(/^delete-button-\d+$/i);

        const expectedValues = allPosts.find(
          (expectedPost) => expectedPost.id === postId,
        );

        expect(postTitle).toHaveTextContent(expectedValues?.title ?? "");
        expect(postBody).toHaveTextContent(expectedValues?.body ?? "");
        expect(postEditButton).toBeInTheDocument();
        expect(postDeleteButton).toBeInTheDocument();
      });
    });
  });

  test("component renders correctly with no posts", async () => {
    // Mock empty post list
    vi.spyOn(axios, "get").mockResolvedValue({ data: [] });

    renderWithClient(
      new QueryClient({ defaultOptions: { queries: { retry: false } } }),
      <Posts />,
    );

    const heading = screen.getByText(/posts/i);
    const newPostButton = screen.getByRole("button", {
      name: /^add random post$/i,
    });
    const postList = screen.getByRole("list");
    const loadingText = screen.getByText(/loading/i);

    expect(heading).toBeInTheDocument();
    expect(newPostButton).toBeInTheDocument();
    expect(postList).toBeInTheDocument();
    expect(loadingText).toBeInTheDocument();

    await waitFor(() => {
      const emptyListText = screen.getByText(/no posts yet/i);

      // Loading complete
      expect(loadingText).not.toBeInTheDocument();
      // Posts list is empty
      expect(emptyListText).toBeInTheDocument();
      expect(() => screen.getAllByRole("listitem")).toThrow();
    });
  });

  test("post list displays correctly", async () => {
    const postId = 1;
    const initialPost = allPosts.find((post) => post.id === postId.toString());

    // Mock initial post list
    vi.spyOn(axios, "get").mockResolvedValue({ data: [initialPost] });

    renderWithClient(
      new QueryClient({ defaultOptions: { queries: { retry: false } } }),
      <Posts />,
    );

    // Expected post displayed correctly in the list
    await waitFor(() => {
      const postList = screen.getAllByRole("listitem");
      const postTitle = within(postList[0]).getByRole("heading");
      const postBody = screen.getByTestId(`post-body-${initialPost?.id}`);
      const postEditButton = screen.getByTestId(
        `edit-button-${initialPost?.id}`,
      );
      const postDeleteButton = screen.getByTestId(
        `delete-button-${initialPost?.id}`,
      );

      expect(postList).toHaveLength(1);
      expect(postTitle).toBeInTheDocument();
      expect(postBody).toBeInTheDocument();
      expect(postEditButton).toBeInTheDocument();
      expect(postDeleteButton).toBeInTheDocument();
    });
  });

  test("add new post", async () => {
    const user = userEvent.setup();

    // Mock initial post list
    vi.spyOn(axios, "get")
      .mockResolvedValueOnce({ data: [] })
      .mockResolvedValueOnce({ data: [newPost] });

    renderWithClient(
      new QueryClient({ defaultOptions: { queries: { retry: false } } }),
      <Posts />,
    );

    const newPostButton = screen.getByRole("button", {
      name: /^add random post$/i,
    });

    // Post list is initially empty
    await waitFor(() => {
      expect(() => screen.getAllByRole("listitem")).toThrow();
    });

    // Add new random post
    await user.click(newPostButton);

    // New post featured in post list
    await waitFor(() => {
      const postList = screen.getAllByRole("listitem");
      const postTitle = within(postList[0]).getByRole("heading");
      const postBody = screen.getByTestId(`post-body-${newPost.id}`);

      expect(postList).toHaveLength(1);
      expect(postTitle).toBeInTheDocument();
      expect(postTitle).toHaveTextContent(`${newPost?.title}#${newPost?.id}`);
      expect(postBody).toHaveTextContent(newPost.body);
    });
  });

  test("edit post", async () => {
    const user = userEvent.setup();

    const postId = 1;
    const initialPost = allPosts.find((post) => post.id === postId.toString());

    // Mock initial post list
    vi.spyOn(axios, "get")
      .mockResolvedValueOnce({ data: [initialPost] })
      .mockResolvedValueOnce({ data: [randomPost] });

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    renderWithClient(queryClient, <Posts />);

    // Post list features initial post
    await waitFor(() => {
      const initialPostList = screen.getAllByRole("listitem");
      const postTitle = within(initialPostList[0]).getByRole("heading");

      expect(initialPostList).toHaveLength(1);
      expect(postTitle).toBeInTheDocument();
      expect(postTitle).toHaveTextContent(
        `${initialPost?.title}#${initialPost?.id}`,
      );
    });

    const postEditButton = screen.getByTestId(`edit-button-${initialPost?.id}`);

    await user.click(postEditButton);

    // Forced refetch required, since mutation
    // has been implemented without network call
    // in the component.
    await queryClient.invalidateQueries({ queryKey: ["posts"] });

    // Edited post displayed in post list
    await waitFor(() => {
      const postList = screen.getAllByRole("listitem");
      const postTitle = within(postList[0]).getByRole("heading");
      const postBody = screen.getByTestId(`post-body-${randomPost.id}`);

      expect(postList).toHaveLength(1);
      expect(postTitle).toBeInTheDocument();
      expect(postTitle).toHaveTextContent(
        `${randomPost?.title}#${randomPost?.id}`,
      );
      expect(postBody).toHaveTextContent(randomPost.body);
    });
  });

  test("delete post", async () => {
    const user = userEvent.setup();

    const postId = 1;
    const initialPost = allPosts.find((post) => post.id === postId.toString());

    // Mock initial post list
    vi.spyOn(axios, "get")
      .mockResolvedValueOnce({ data: [initialPost] })
      .mockResolvedValueOnce({ data: [] });

    const axiosSpy = vi.spyOn(axios, "delete");

    renderWithClient(
      new QueryClient({ defaultOptions: { queries: { retry: false } } }),
      <Posts />,
    );

    // Post list features initial post
    await waitFor(() => {
      const postList = screen.getAllByRole("listitem");

      expect(postList).toHaveLength(1);
    });

    const deleteEditButton = screen.getByTestId(
      `delete-button-${initialPost?.id}`,
    );

    // Delete the post
    await user.click(deleteEditButton);

    // Post list is now empty
    await waitFor(() => {
      const emptyListText = screen.getByText(/no posts yet/i);
      const axiosResponse = axiosSpy.mock.results[0].value as AxiosResponse;

      expect(axiosResponse.data).toStrictEqual(initialPost);
      expect(emptyListText).toBeInTheDocument();
      expect(() => screen.getAllByRole("listitem")).toThrow();
    });
  });
});
