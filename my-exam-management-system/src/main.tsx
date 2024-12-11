import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { routes } from "./routes";
import { ThemeProvider } from "@contexts/index";
import {
  AdminTokenProvider,
  ClientTokenProvider,
} from "./contexts/AutherContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AdminTokenProvider>
    <ClientTokenProvider>
      {/* <React.StrictMode> */}
        <ThemeProvider>
          <RouterProvider router={routes}></RouterProvider>
        </ThemeProvider>
      {/* </React.StrictMode> */}
    </ClientTokenProvider>
  </AdminTokenProvider>
);
