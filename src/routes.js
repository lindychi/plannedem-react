import React from "react";
import { Outlet } from "react-router";
import Login from "./pages/Login";

const routes = [
  {
    path: "/",
    element: <Login />,
    breadcrumb: "CMS",
  },
];

export default routes;
