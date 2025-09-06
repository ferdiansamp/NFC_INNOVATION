import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import RouteFront from "./Route_Front.js";

const root = createRoot(document.getElementById("root"));
root.render(
 <BrowserRouter>
    <RouteFront />
</BrowserRouter>
);
