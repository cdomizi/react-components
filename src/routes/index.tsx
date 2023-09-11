import loadable from "@loadable/component";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

// Project import
const RootLayout = loadable(() => import("../layouts/RootLayout"));
const Home = loadable(() => import("../pages/Home"));
const Forms = loadable(() => import("../pages/Forms"));

const MainRoutes = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Home />} />
      <Route path="forms" element={<Forms />} />
    </Route>
  )
);

export default MainRoutes;
