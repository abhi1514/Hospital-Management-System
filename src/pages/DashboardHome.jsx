// src/pages/DashboardHome.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardHome() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1 className="mb-4">Welcome to HIMS Dashboard</h1>

      <div className="row">
        <div className="col-md-4 mb-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Total Patients</h5>
              <p className="card-text">120</p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Appointments Today</h5>
              <p className="card-text">8</p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Doctors Available</h5>
              <p className="card-text">5</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h4>Quick Actions</h4>
        <div className="d-flex gap-3 flex-wrap">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/dashboard/register")}
          >
            Register Patient
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/dashboard/patients")}
          >
            View All Patients
          </button>
        </div>
      </div>
    </div>
  );
}
