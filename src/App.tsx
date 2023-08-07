import { RouterProvider } from "react-router-dom";

// Project import
import MainRoutes from "./MainRoutes";

const App = () => {
  return (
    <div className="App">
      <RouterProvider router={MainRoutes} />
    </div>
  );
};

export default App;
