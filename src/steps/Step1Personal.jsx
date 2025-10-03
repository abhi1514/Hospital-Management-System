import React, { useEffect, useState } from "react";
import { getBloodGroups, getSalutations } from "../api/apiService";

export default function Step1Personal({ formData, handleChange, nextStep, handleFileChange, file }) {
  const [salutations, setSalutations] = useState([]);
  const [bloodGroups, setBloodGroups] = useState([]);
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(null);

  // Fetch salutations and blood groups
  useEffect(() => {
    getSalutations()
      .then((res) => setSalutations(res.data.data || []))
      .catch(console.error);

    getBloodGroups()
      .then((res) => setBloodGroups(res.data.data || []))
      .catch(console.error);
  }, []);

  // Update profile picture preview
  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  }, [file]);

  // Validate mandatory fields
  const validate = () => {
    const newErrors = {};
    if (!formData.salutation) newErrors.salutation = "Required";
    if (!formData.firstName?.trim()) newErrors.firstName = "Required";
    if (!formData.gender) newErrors.gender = "Required";
    if (!formData.ageYears || formData.ageYears < 0) newErrors.ageYears = "Invalid age";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validate()) {
      alert("Please fill all required fields: Salutation, First Name, Gender, Age");
      return;
    }
    nextStep();
  };

  return (
    <div className="container mt-3">
      <h5>Step 1: Personal Information</h5>

      {/* Salutation */}
      <div className="mb-3">
        <label>Salutation*</label>
        <select
          name="salutation"
          value={formData.salutation}
          onChange={handleChange}
          className={`form-control ${errors.salutation ? "is-invalid" : ""}`}
        >
          <option value="">Select Salutation</option>
          {salutations.map((s) => (
            <option key={s.salutationID} value={s.salutationID}>{s.salutation}</option>
          ))}
        </select>
        <div className="invalid-feedback">{errors.salutation}</div>
      </div>

      {/* First Name */}
      <div className="mb-3">
        <label>First Name*</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
        />
        <div className="invalid-feedback">{errors.firstName}</div>
      </div>

      {/* Gender */}
      <div className="mb-3">
        <label>Gender*</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className={`form-control ${errors.gender ? "is-invalid" : ""}`}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <div className="invalid-feedback">{errors.gender}</div>
      </div>

      {/* Age */}
      <div className="mb-3">
        <label>Age (Years)*</label>
        <input
          type="number"
          name="ageYears"
          value={formData.ageYears}
          onChange={handleChange}
          className={`form-control ${errors.ageYears ? "is-invalid" : ""}`}
        />
        <div className="invalid-feedback">{errors.ageYears}</div>
      </div>

      {/* Date of Birth */}
      <div className="mb-3">
        <label>Date of Birth</label>
        <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="form-control" />
      </div>

      {/* Mobile */}
      <div className="mb-3">
        <label>Mobile</label>
        <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} className="form-control" />
      </div>

      {/* Email */}
      <div className="mb-3">
        <label>Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" />
      </div>

      {/* Blood Group */}
      <div className="mb-3">
        <label>Blood Group</label>
        <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="form-control">
          <option value="">Select Blood Group</option>
          {bloodGroups.map((b) => (
            <option key={b.bloodGroupID} value={b.bloodGroupID}>{b.bloodGroup}</option>
          ))}
        </select>
      </div>

      {/* Weight */}
      <div className="mb-3">
        <label>Weight (kg)</label>
        <input type="number" name="weight" value={formData.weight} onChange={handleChange} className="form-control" />
      </div>

      {/* Height */}
      <div className="mb-3">
        <label>Height (cm)</label>
        <input type="number" name="height" value={formData.height} onChange={handleChange} className="form-control" />
      </div>

      {/* Profile Picture */}
      <div className="mb-3">
        <label>Profile Picture (Optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="form-control"
        />
        {preview && (
          <img
            src={preview}
            alt="Profile Preview"
            style={{ marginTop: 10, width: 100, height: 100, objectFit: "cover", borderRadius: "50%" }}
          />
        )}
      </div>

      <button className="btn btn-primary" onClick={handleNext}>
        Next ➡️
      </button>
    </div>
  );
}
