import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { ReactNode } from "react";
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

describe("Posts", () => {
  test("component renders correctly", () => {
    render(<Posts />, { wrapper });

    const heading = screen.getByText(/posts/i);
    const newPostButton = screen.getByRole("button", {
      name: /^add random post$/i,
    });
    const loadingText = screen.getByText(/loading/i);

    expect(heading).toBeInTheDocument();
    expect(newPostButton).toBeInTheDocument();
    expect(loadingText).toBeInTheDocument();
  });
});
