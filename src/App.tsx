import { RouterProvider } from "react-router-dom";

// Project import
import { ReactQueryWrapper } from "./contexts/ReactQueryWrapper";
import { ThemeCustomization } from "./layouts/ThemeCustomization";
import MainRoutes from "./routes";

const App = () => {
  return (
    <div className="App">
      <ThemeCustomization>
        <ReactQueryWrapper>
          <RouterProvider router={MainRoutes} />
        </ReactQueryWrapper>
      </ThemeCustomization>
    </div>
  );
};

export default App;
