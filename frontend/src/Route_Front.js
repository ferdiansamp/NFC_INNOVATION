import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./App";
import Kereta from "./Kereta";

export default function RouteFront() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/kereta" element={<Kereta />} />
      </Routes>

  );
}