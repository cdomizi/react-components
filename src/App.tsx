import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Project import
import MainRoutes from "./routes";
import ThemeCustomization from "./layouts/ThemeCustomization";

const queryClient = new QueryClient();

const App = () => {
  return (
    <div className="App">
      <ThemeCustomization>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={MainRoutes} />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ThemeCustomization>
    </div>
  );
};

export default App;
