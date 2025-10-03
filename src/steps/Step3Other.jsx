import React, { useEffect, useState } from "react";
import { getDoctors, getVaccines, getIdProofs, getVisitReasons } from "../api/apiService";

export default function Step3Other({ formData, handleChange, prevStep, handleSubmit, loading }) {
const [doctors, setDoctors] = useState([]);
const [vaccines, setVaccines] = useState([]);
const [idProofs, setIdProofs] = useState([]);
const [reasons, setReasons] = useState([]);

// Fetch data from APIs
useEffect(() => {
getDoctors().then((res) => {
console.log("Doctors API Response:", res.data);
setDoctors(res.data?.data || []);
});
getVaccines().then((res) => {
console.log("Vaccines API Response:", res.data);
setVaccines(res.data?.data || []);
});
getIdProofs().then((res) => {
console.log("ID Proofs API Response:", res.data);
setIdProofs(res.data?.data || []);
});
getVisitReasons().then((res) => {
console.log("Visit Reasons API Response:", res.data);
setReasons(res.data?.data || []);
});
}, []);

// Validation: mandatory fields
const isValid = formData.reasonOfVisit && formData.assignDoctor;

return ( <div className="container mt-3"> <h5>Step 3: Other Information</h5>

  {/* ID Proof */}
  <div className="mb-3">
    <label>ID Proof</label>
    <select
      name="idProof"
      value={formData.idProof}
      onChange={handleChange}
      className="form-control"
    >
      <option value="">Select ID Proof</option>
      {Array.isArray(idProofs) &&
        idProofs.map((i) => (
          <option key={i.proofID} value={i.proofID}>
            {i.proofName}
          </option>
        ))}
    </select>
  </div>

  {/* Proof Number */}
  <div className="mb-3">
    <label>Proof Number</label>
    <input
      type="text"
      name="proofNumber"
      value={formData.proofNumber}
      onChange={handleChange}
      className="form-control"
      placeholder="Enter Proof Number"
    />
  </div>

  {/* Reason of Visit (Mandatory) */}
  <div className="mb-3">
    <label>Reason of Visit*</label>
    <select
      name="reasonOfVisit"
      value={formData.reasonOfVisit}
      onChange={handleChange}
      className={`form-control ${!formData.reasonOfVisit ? "border-danger" : ""}`}
      required
    >
      <option value="">Select Reason</option>
      {Array.isArray(reasons) &&
        reasons.map((r) => (
          <option key={r.reasonID} value={r.reasonID}>
            {r.reason}
          </option>
        ))}
    </select>
  </div>

  {/* Vaccine */}
  <div className="mb-3">
    <label>Vaccine</label>
    <select
      name="vaccineFlag"
      value={formData.vaccineFlag}
      onChange={handleChange}
      className="form-control"
    >
      <option value="">Select Vaccine</option>
      {Array.isArray(vaccines) &&
        vaccines.map((v) => (
          <option key={v.vaccineID} value={v.vaccineID}>
            {v.vaccine}
          </option>
        ))}
    </select>
  </div>

  {/* Assign Doctor (Mandatory) */}
  <div className="mb-3">
    <label>Assign Doctor*</label>
    <select
      name="assignDoctor"
      value={formData.assignDoctor}
      onChange={handleChange}
      className={`form-control ${!formData.assignDoctor ? "border-danger" : ""}`}
      required
    >
      <option value="">Select Doctor</option>
      {Array.isArray(doctors) &&
        doctors.map((d) => (
          <option key={d.doctorID} value={d.doctorID}>
            {d.doctorName} ({d.degree})
          </option>
        ))}
    </select>
  </div>

  <div className="d-flex justify-content-between mt-4">
    <button className="btn btn-secondary" onClick={prevStep}>
      Previous
    </button>
    <button
      className="btn btn-success"
      onClick={handleSubmit}
      disabled={!isValid || loading}
    >
      {loading ? "Submitting..." : "Submit"}
    </button>
  </div>
</div>

);
}
