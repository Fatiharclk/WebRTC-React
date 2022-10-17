import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "../screen/Home/Home";
import Login from "../screen/Login/Login";
export default function Navigation() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
