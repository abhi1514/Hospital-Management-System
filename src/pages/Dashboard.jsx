// src/pages/Dashboard.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Layout from "../components/Layout";

export default function Dashboard() {
  return (
    <Layout>
      {/* Nested routes will render here */}
      <Outlet />
    </Layout>
  );
}
