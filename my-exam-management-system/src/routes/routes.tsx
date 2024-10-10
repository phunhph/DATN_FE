// routes.js
import AdminLayout from "../layouts/admin/AdminLayout";
import ClientLayout from "../layouts/client/ClientLayout";
import { createBrowserRouter } from "react-router-dom";
import adminRoutes from "./adminRoutes";
import clientRoutes from "./clientRoutes";
import Login from "../modules/Login/Login";
import ErrorPage from "../modules/ErrorPage/ErrorPage";

const routes = createBrowserRouter([
  { path: "/", element: <Login /> },
  {
    path: "/admin",
    element: <AdminLayout />,
    errorElement: <ErrorPage />,
    children: adminRoutes,
  },
  {
    path: "/client",
    element: <ClientLayout />,
    errorElement: <ErrorPage />,
    children: clientRoutes,
  },
]);

export default routes;
