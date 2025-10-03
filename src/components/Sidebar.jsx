import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  return (
    <nav
      className="d-flex flex-column flex-shrink-0 p-3 bg-dark text-white sidebar"
    >
      <a
        href="/"
        className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-decoration-none text-white"
      >
        <span className="fs-4 fw-bold">HIMS</span>
      </a>
      <hr className="text-white" />
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item mb-2">
          <Link
            className={`nav-link ${location.pathname === "/dashboard" ? "active bg-white text-dark" : "text-white"}`}
            to="/dashboard"
          >
            🏠 Home
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link
            className={`nav-link ${location.pathname.includes("register") ? "active bg-white text-dark" : "text-white"}`}
            to="/dashboard/register"
          >
            ➕ Register Patient
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link
            className={`nav-link ${location.pathname.includes("patients") ? "active bg-white text-dark" : "text-white"}`}
            to="/dashboard/patients"
          >
            👥 All Patients
          </Link>
        </li>
      </ul>
      <hr className="text-white" />
      <div className="text-white small">© 2025 HIMS</div>
    </nav>
  );
}
