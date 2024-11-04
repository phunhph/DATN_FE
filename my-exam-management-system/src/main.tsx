import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { routes } from "./routes";
import { ThemeProvider, TokenProvider } from "@contexts/index";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <TokenProvider>
    <React.StrictMode>
      <ThemeProvider>
        <RouterProvider router={routes}></RouterProvider>
      </ThemeProvider>
    </React.StrictMode>
  </TokenProvider>
);
