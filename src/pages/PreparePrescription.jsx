// src/pages/PreparePrescription.jsx
import React, { useEffect, useState } from "react";
import { getAllMedicines, getAllMedicineTypes, getAllInstructions, savePrescription } from "../api/apiService";

export default function PreparePrescription({ patientId, regnId, existingPrescription }) {
  const [medicineTypes, setMedicineTypes] = useState([]);
  const [allMedicines, setAllMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [instructions, setInstructions] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [nextFollowUpDate, setNextFollowUpDate] = useState("");

  const countOptions = Array.from({ length: 31 }, (_, i) => i + 1);

  const [prescriptionForm, setPrescriptionForm] = useState({
    followUpType: "DAY",
    followUpCount: "",
    unit: "",
    route: "",
    doseType: "",
    days: "",
    quantity: "",
    instructionId: "",
    doseTimings: [
      { id: "morning", label: "Morning", checked: false, dose: 0 },
      { id: "afternoon", label: "Afternoon", checked: false, dose: 0 },
      { id: "evening", label: "Evening", checked: false, dose: 0 },
      { id: "night", label: "Night", checked: false, dose: 0 },
    ],
  });

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [typesRes, medicinesRes, instructionsRes] = await Promise.all([
          getAllMedicineTypes(),
          getAllMedicines(),
          getAllInstructions(),
        ]);
        setMedicineTypes(typesRes.data || []);
        setAllMedicines(medicinesRes.data || []);
        setInstructions(instructionsRes.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  // Load existing prescription if any
  useEffect(() => {
    if (existingPrescription) {
      setPrescriptionForm(prev => ({
        ...prev,
        ...existingPrescription
      }));
      setSelectedMedicine(existingPrescription.selectedMedicine || null);
    }
  }, [existingPrescription]);

  const onChangeMType = (e) => {
    const typeId = parseInt(e.target.value);
    setFilteredMedicines(allMedicines.filter(m => m.mtypeID === typeId));
    setSelectedMedicine(null);
  };

  const compareMedicines = (a, b) => (a && b ? a.medID === b.medID : a === b);

  const calculateNextFollowUpDate = () => {
    const { followUpType, followUpCount } = prescriptionForm;
    if (!followUpCount) return;
    const date = new Date();
    const count = parseInt(followUpCount);
    if (followUpType === "DAY") date.setDate(date.getDate() + count);
    if (followUpType === "WEEK") date.setDate(date.getDate() + count * 7);
    if (followUpType === "MONTH") date.setMonth(date.getMonth() + count);
    setNextFollowUpDate(date.toLocaleDateString("en-GB"));
  };

  const onDoseToggle = (idx) => {
    const updated = [...prescriptionForm.doseTimings];
    updated[idx].checked = !updated[idx].checked;
    setPrescriptionForm({ ...prescriptionForm, doseTimings: updated });
  };

  const getTotalDose = () =>
    prescriptionForm.doseTimings.reduce((total, dt) => total + (dt.checked ? Number(dt.dose) : 0), 0);

  const save = async (e) => {
    e.preventDefault();
    try {
      const payload = { patientId, regnId, prescription: prescriptionForm };
      await savePrescription(payload);
      alert("Prescription saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Error saving prescription");
    }
  };

  return (
    <div className="container mt-4">
      <form onSubmit={save}>
        <div className="card shadow-sm">
          <div className="card-header bg-light">
            <h5 className="mb-0 text-purple">Follow-up After</h5>
          </div>

          <div className="card-body">
            {/* Follow-up */}
            <div className="row mb-4">
              <div className="col-md-4">
                <label className="form-label fw-bold">Type</label>
                <select
                  className="form-select"
                  value={prescriptionForm.followUpType}
                  onChange={(e) => setPrescriptionForm({ ...prescriptionForm, followUpType: e.target.value }, calculateNextFollowUpDate())}
                >
                  <option value="DAY">DAY</option>
                  <option value="WEEK">WEEK</option>
                  <option value="MONTH">MONTH</option>
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label fw-bold">Count</label>
                <select
                  className="form-select"
                  value={prescriptionForm.followUpCount}
                  onChange={(e) => setPrescriptionForm({ ...prescriptionForm, followUpCount: e.target.value }, calculateNextFollowUpDate())}
                >
                  <option value="">SELECT</option>
                  {countOptions.map(num => <option key={num} value={num}>{num}</option>)}
                </select>
              </div>

              <div className="col-md-4 d-flex align-items-end">
                <span className="text-muted">Next follow-up on: <strong>{nextFollowUpDate || "-"}</strong></span>
              </div>
            </div>

            <hr className="my-3" />

            {/* Medicine Selection */}
            <div className="row mb-4">
              <div className="col-md-6">
                <label className="form-label fw-bold">Medicine Type</label>
                <select className="form-select" onChange={onChangeMType}>
                  <option value="">-- Select Type --</option>
                  {medicineTypes.map(type => <option key={type.mtypeID} value={type.mtypeID}>{type.typeName}</option>)}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold">Select Medicine</label>
                <select
                  className="form-select"
                  value={selectedMedicine || ""}
                  onChange={(e) => setSelectedMedicine(JSON.parse(e.target.value))}
                >
                  <option value="">-- Select Medicine --</option>
                  {filteredMedicines.map(med => (
                    <option key={med.medID} value={JSON.stringify(med)}>{med.medName}</option>
                  ))}
                </select>
              </div>
            </div>

            <hr className="my-3" />

            {/* Action Buttons */}
            <div className="row mt-4">
              <div className="col-md-12 d-flex justify-content-end gap-2">
                <button type="submit" className="btn btn-purple px-4">Save Prescription</button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
