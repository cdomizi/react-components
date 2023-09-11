import { RouterProvider } from "react-router-dom";

// Project import
import Routes from "./routes";

const App = () => {
  return (
    <div className="App">
      <RouterProvider router={Routes} />
    </div>
  );
};

export default App;
