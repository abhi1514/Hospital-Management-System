// src/pages/PatientDiet.jsx
import React, { useEffect, useState } from "react";
import { getPatientDietTemplate, insertOrUpdatePatientDiet } from "../api/apiService";

export default function PatientDiet({ patientId, regnId }) {
  const [loading, setLoading] = useState(true);
  const [dietTemplate, setDietTemplate] = useState([]);
  const [dietForm, setDietForm] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDietTemplate = async () => {
      try {
        setLoading(true);
        const res = await getPatientDietTemplate();
        setDietTemplate(res.data || []);
        // Initialize form state with empty values
        setDietForm(res.data?.map((item) => ({ ...item, value: "" })) || []);
      } catch (err) {
        console.error("Error fetching diet template:", err);
        setError("Failed to load diet template.");
      } finally {
        setLoading(false);
      }
    };

    if (patientId && regnId) fetchDietTemplate();
  }, [patientId, regnId]);

  const handleChange = (index, value) => {
    const updated = [...dietForm];
    updated[index].value = value;
    setDietForm(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      patientId,
      regnId,
      dietDetails: dietForm.map((item) => ({
        dietId: item.dietId,
        value: item.value,
      })),
    };

    try {
      await insertOrUpdatePatientDiet(payload);
      alert("Patient diet saved successfully!");
    } catch (err) {
      console.error("Error saving diet:", err);
      alert("Failed to save diet.");
    }
  };

  if (loading) return <p>Loading patient diet...</p>;
  if (error) return <p className="text-danger">{error}</p>;
  if (!dietForm.length) return <p>No diet template available.</p>;

  return (
    <div className="container">
      <h5 className="mb-3">Patient Diet</h5>
      <form onSubmit={handleSubmit}>
        {dietForm.map((item, idx) => (
          <div className="mb-3" key={item.dietId}>
            <label className="form-label">{item.dietName}</label>
            <input
              type="text"
              className="form-control"
              value={item.value || ""}
              onChange={(e) => handleChange(idx, e.target.value)}
            />
          </div>
        ))}

        <div className="d-flex justify-content-end">
          <button type="submit" className="btn btn-purple px-4">
            Save Diet
          </button>
        </div>
      </form>
    </div>
  );
}
