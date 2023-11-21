import loadable from "@loadable/component";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

// Project import
const RootLayout = loadable(() => import("../layouts/RootLayout"));
const Home = loadable(() => import("../pages/Home"));
const ErrorPage = loadable(() => import("../pages/ErrorPage"));
const Forms = loadable(() => import("../pages/Forms"));
const Fetch = loadable(() => import("../pages/Fetch"));
const Todos = loadable(() => import("../pages/Todos"));
const Posts = loadable(() => import("../pages/Posts"));

const MainRoutes = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />} errorElement={<ErrorPage />}>
      <Route index element={<Home />} />
      <Route path="forms" element={<Forms />} />
      <Route path="fetch" element={<Fetch />} />
      <Route path="todos" element={<Todos />} />
      <Route path="posts" element={<Posts />} />
    </Route>,
  ),
);

export default MainRoutes;
