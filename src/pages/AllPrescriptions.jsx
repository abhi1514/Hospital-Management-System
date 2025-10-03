import React, { useEffect, useState } from "react";
import { getAllPrescriptions } from "../api/apiService";
import { useNavigate } from "react-router-dom";

export default function AllPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const res = await getAllPrescriptions();
        setPrescriptions(res.data || []);
      } catch (err) {
        console.error("Error fetching prescriptions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  if (loading) return <p>Loading prescriptions...</p>;
  if (!prescriptions.length) return <p>No prescriptions found.</p>;

  return (
    <div className="container mt-4">
      <h5>All Prescriptions</h5>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>REGN ID</th>
            <th>Patient Name</th>
            <th>Doctor Name</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {prescriptions.map((p) => (
            <tr
              key={p.registration.regnID}
              style={{ cursor: "pointer" }}
              onClick={() =>
                navigate(`/dashboard/prescription/${p.registration.regnID}`, {
                  state: { 
                    patientId: p.patient.patientID, 
                    doctorID: p.registration.doctorID 
                  },
                })
              }
            >
              <td>{p.registration.regnID}</td>
              <td>{p.patient.patientName}</td>
              <td>{p.registration.doctorName}</td>
              <td>{new Date(p.registration.regnDateAndTime).toLocaleDateString("en-GB")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
