// clientRoutes.js
import { Navigate } from "react-router-dom";
import { Home, Scores, History } from "../modules/client/index";

const clientRoutes = [
  { path: "", element: <Navigate to="/client/home" replace /> },
  { path: "home", element: <Home /> },
  { path: "scores", element: <Scores /> },
  { path: "history", element: <History /> },
];

export default clientRoutes;
