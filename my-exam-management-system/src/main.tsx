import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "@scss/theme.scss"
import { RouterProvider } from "react-router-dom";
import { routes } from "./routes";
import { TokenProvider} from "./contexts/AutherContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <TokenProvider>
      <React.StrictMode>
        <RouterProvider router={routes}></RouterProvider>
      </React.StrictMode>
  </TokenProvider>
);
