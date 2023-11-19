import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Project import
import Routes from "./routes";
import ThemeCustomization from "./layouts/ThemeCustomization";

const queryClient = new QueryClient();

const App = () => {
  return (
    <div className="App">
      <ThemeCustomization>
        <QueryClientProvider client={queryClient}>
          <Routes />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ThemeCustomization>
    </div>
  );
};

export default App;
