// src/components/Layout.jsx
import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar (fixed width, full height) */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-grow-1 d-flex flex-column">
        {/* Navbar at the top */}
        <Navbar />

        {/* Page content */}
        <div className="flex-grow-1 bg-light p-3">
          {children}
        </div>
      </div>
    </div>
  );
}
