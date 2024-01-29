import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor, within } from "@testing-library/react";
import axios from "axios";
import { allPosts, randomPost } from "mocks/data";
import { ReactNode } from "react";
import * as delayUtils from "utils/delay";
import * as getRandomData from "utils/getRandomData";
import Posts from "..";

// Set up query client for testing
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});
const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

// Clear query client after each test
afterEach(() => {
  queryClient.clear();
});

beforeEach(() => {
  // Mock random post
  vi.spyOn(getRandomData, "getRandomData").mockResolvedValue(randomPost);

  // Mock Axios response
  vi.spyOn(axios, "get").mockResolvedValue({ data: allPosts });

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
    render(<Posts />, { wrapper });

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
      expect(posts.length).toBe(allPosts.length);
      posts.forEach((post) => {
        const postId = within(post)
          .getByText(/^#\d+$/i)
          .textContent?.slice(1);
        const postTitle = within(post).getByRole("heading");
        const postBody = within(post).getByTestId(/^post-body-\d+/);
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
    // Mock empty posts list
    vi.spyOn(axios, "get").mockResolvedValue({ data: [] });

    render(<Posts />, { wrapper });

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

  test.todo("add new post");

  test.todo("edit post");

  test.todo("delete post");
});
