// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DashboardHome from "./pages/DashboardHome";
import PatientRegister from "./pages/PatientRegister";
import AllPatients from "./pages/AllPatients";
import PrescriptionDetails from "./pages/PrescriptionDetails";
import PreparePrescription from "./pages/PreparePrescription";
import ServicesAdvised from "./pages/ServicesAdvised";
import  PatientDiet from "./pages/PatientDiet";
import MainComplaint from "./pages/MainComplaint";

function App() {
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        {/* Login route */}
        <Route path="/login" element={<Login />} />

        {/* Protected dashboard routes */}
        <Route
          path="/dashboard"
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
        >
          <Route index element={<DashboardHome />} />
          <Route path="register" element={<PatientRegister />} />
          <Route path="patients" element={<AllPatients />} />

          {/* Prescription routes */}
          <Route path="prescription/:regnID" element={<PrescriptionDetails />} />
          <Route path="prepare-prescription/:regnID" element={<PreparePrescription />} />

          {/* Services Advised */}
          <Route path="services-advised/:regnID" element={<ServicesAdvised />} />

          {/* Diet */}
          <Route path="diet/:regnID" element={<PatientDiet />} />

          {/* Main Complaint */}
          <Route path="main-complaint/:regnID" element={<MainComplaint />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
