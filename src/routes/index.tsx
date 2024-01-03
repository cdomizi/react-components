import loadable from "@loadable/component";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

// Project import
const RootLayout = loadable(() => import("layouts/RootLayout"));
const Home = loadable(() => import("pages/Home"));
const ErrorPage = loadable(() => import("pages/ErrorPage"));
const Forms = loadable(() => import("@Forms/index"));
const Fetch = loadable(() => import("@Fetch/index"));
const Todos = loadable(() => import("@Todos/index"));
const Posts = loadable(() => import("@Posts/index"));

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
