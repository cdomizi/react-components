import { RouterProvider } from "react-router-dom";

// Project import
import { AuthProvider } from "contexts/AuthContext";
import { ReactQueryWrapper } from "./contexts/ReactQueryWrapper";
import { ThemeCustomization } from "./layouts/ThemeCustomization";
import MainRoutes from "./routes";

const App = () => {
  return (
    <div className="App">
      <ThemeCustomization>
        <ReactQueryWrapper>
          <AuthProvider>
            <RouterProvider router={MainRoutes} />
          </AuthProvider>
        </ReactQueryWrapper>
      </ThemeCustomization>
    </div>
  );
};

export default App;
