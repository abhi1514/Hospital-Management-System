// src/pages/AllPatients.jsx
import React, { useEffect, useState } from "react";
import { getAllPatients } from "../api/apiService";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useNavigate } from "react-router-dom";

export default function AllPatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Search filters (used for search button)
  const [filters, setFilters] = useState({
    tokenNo: "",
    doctorName: "",
    patientName: ""
  });

  // Display only (dates not used for search)
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async (searchFilters = {}) => {
    try {
      setLoading(true);

      // Build query params for search
      const params = new URLSearchParams();
      if (searchFilters.tokenNo) params.append("TokenNo", searchFilters.tokenNo);
      if (searchFilters.doctorName) params.append("DoctorName", searchFilters.doctorName);
      if (searchFilters.patientName) params.append("PatientName", searchFilters.patientName);

      const res = await getAllPatients(params.toString());
      console.log("API Response:", res.data); // Check response structure

      // Set patients (array returned by API)
      setPatients(res.data || []);
    } catch (err) {
      console.error("❌ Failed to fetch patients:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    fetchPatients(filters);
  };

  const openPrescription = (regnID) => {
    navigate(`/dashboard/prescription/${regnID}`);
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      patients.map((p) => ({
        UHID: p.patientID || "-",
        TokenNo: p.tokenNo || p.registrationNo || "-",
        PatientName: p.patientName || "-",
        Gender: p.gender || "-",
        DoctorName: p.doctorName || "-",
        DOB: p.dob ? new Date(p.dob).toLocaleDateString() : "-"
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Patients");
    XLSX.writeFile(workbook, "Patients.xlsx");
  };
const exportPDF = () => {
  const doc = new jsPDF();

  const tableColumn = ["UHID", "Token No", "Patient Name", "Gender", "Doctor Name", "DOB"];
  const tableRows = patients.map((p) => [
    p.patientID || "-",
    p.tokenNo || p.registrationNo || "-",
    p.patientName || "-",
    p.gender || "-",
    p.doctorName || "-",
    p.dob ? new Date(p.dob).toLocaleDateString() : "-"
  ]);

  // AutoTable v5+ syntax
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 20
  });

  doc.text("All Patients", 14, 15);
  doc.save("Patients.pdf");
};
  return (
    <div className="container mt-3">
      <h4 className="mb-3">👥 All Patients - Advanced Search</h4>

      <div className="card p-3 mb-3 shadow-sm">
        <div className="row g-2 align-items-end">
          {/* Left side: search fields */}
          <div className="col-md-3">
            <input
              type="text"
              name="tokenNo"
              placeholder="Search by Token Number"
              value={filters.tokenNo}
              onChange={handleFilterChange}
              className="form-control"
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              name="doctorName"
              placeholder="Search by Doctor Name"
              value={filters.doctorName}
              onChange={handleFilterChange}
              className="form-control"
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              name="patientName"
              placeholder="Search by Patient Name"
              value={filters.patientName}
              onChange={handleFilterChange}
              className="form-control"
            />
          </div>

          {/* Right side: From / To Date (display only) */}
          <div className="col-md-2">
            <label className="form-label mb-1">From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="col-md-2">
            <label className="form-label mb-1">To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="form-control"
            />
          </div>

          {/* Buttons */}
          <div className="col-md-4 d-flex gap-2 align-items-end mt-2">
            <button
              className="btn btn-primary flex-grow-1"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? "Searching..." : "Search"}
            </button>
            <button className="btn btn-success flex-grow-1" onClick={exportExcel}>
              Export Excel
            </button>
            <button className="btn btn-danger flex-grow-1" onClick={exportPDF}>
              Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* 🧾 Patients Table */}
      <div className="table-responsive shadow-sm">
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>UHID</th>
              <th>Token No</th>
              <th>Patient Name</th>
              <th>Gender</th>
              <th>Doctor Name</th>
              <th>DOB</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {!loading && patients.length > 0 ? (
              patients.map((p, idx) => (
                <tr key={idx}>
                  <td>{p.patientID || "-"}</td>
                  <td>{p.tokenNo || p.registrationNo || "-"}</td>
                  <td>{p.patientName || "-"}</td>
                  <td>{p.gender || "-"}</td>
                  <td>{p.doctorName || "-"}</td>
                  <td>{p.dob ? new Date(p.dob).toLocaleDateString() : "-"}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-info me-2"
                      onClick={() => openPrescription(p.patientID)}
                    >
                      Prescriptions
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  {loading ? "Loading..." : "No records found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
