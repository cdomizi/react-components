import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { allPosts, randomPost } from "mocks/data";
import { ReactNode } from "react";
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
  vi.spyOn(axios, "get").mockResolvedValue(allPosts);
});

describe("Posts", () => {
  test("component renders correctly", async () => {
    render(<Posts />, { wrapper });

    const heading = screen.getByText(/posts/i);
    const newPostButton = screen.getByRole("button", {
      name: /^add random post$/i,
    });
    const loadingText = screen.getByText(/loading/i);

    expect(heading).toBeInTheDocument();
    expect(newPostButton).toBeInTheDocument();
    expect(loadingText).toBeInTheDocument();

    await waitFor(() => {
      const postsIdList = screen.getAllByText(/#/i);

      // Loading complete
      expect(loadingText).not.toBeInTheDocument();
      // Posts list is empty
      expect(postsIdList).toBeInTheDocument();
      expect(postsIdList.length).toBe(allPosts.length);
    });
  });

  test.only("component renders correctly with no posts", async () => {
    // Mock empty posts list
    vi.spyOn(axios, "get").mockResolvedValue([]);

    render(<Posts />, { wrapper });

    const heading = screen.getByText(/posts/i);
    const newPostButton = screen.getByRole("button", {
      name: /^add random post$/i,
    });
    const loadingText = screen.getByText(/loading/i);

    expect(heading).toBeInTheDocument();
    expect(newPostButton).toBeInTheDocument();
    expect(loadingText).toBeInTheDocument();

    await waitFor(() => {
      const emptyListText = screen.getByText(/no posts yet/i);

      expect(loadingText).not.toBeInTheDocument();
      expect(emptyListText).toBeInTheDocument();
      expect(screen.getAllByText(/#/i)).toThrow();
    });
  });

  test.todo("add new post");

  test.todo("edit post");

  test.todo("delete post");
});
