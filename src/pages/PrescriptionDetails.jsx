// src/pages/PrescriptionDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainComplaint from "./MainComplaint";
import PreparePrescription from "./PreparePrescription";
import ServicesAdvised from "./ServicesAdvised";
import PatientDiet from "./PatientDiet";
import { getRegistrationById } from "../api/apiService"; // ✅ new API

export default function PrescriptionDetails({ currentUser }) {
  const { regnID } = useParams();
  const navigate = useNavigate();

  const [registrationData, setRegistrationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("mainComplaint");
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [newTemplateName, setNewTemplateName] = useState("");

  useEffect(() => {
    const fetchRegistration = async () => {
      try {
        setLoading(true);
        const res = await getRegistrationById(regnID);
        if (res.data?.statusCode === 200 && res.data.data.length > 0) {
          setRegistrationData(res.data.data[0]);
        }
      } catch (err) {
        console.error("Error fetching registration:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRegistration();
  }, [regnID]);

  if (loading) return <p>Loading prescription data...</p>;
  if (!registrationData) return <p>No prescription data found.</p>;

  const { registration, patient, ptPictureDto } = registrationData;

  const addTemplate = () => {
    if (!newTemplateName.trim()) return;
    setTemplates([...templates, { tempId: templates.length + 1, tempName: newTemplateName }]);
    setNewTemplateName("");
    setShowTemplateModal(false);
  };

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5>PRESCRIPTION DETAILS</h5>
        <button className="btn matstepbtn" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>

      {/* Patient Info */}
      <div className="px-4 pt-3 d-flex gap-4">
        <div>
          <img
            src={ptPictureDto?.picturePath || "/assets/default-profile.png"}
            alt="Patient"
            width={100}
            height={100}
            className="rounded border"
          />
        </div>
        <div>
          <b>REGNID:</b> {registration?.regnID || "N/A"} <br />
          <b>Patient ID:</b> {patient?.patientID || "N/A"} <br />
          <b>Doctor ID:</b> {registration?.doctorID || "N/A"} <br />
          <b>Doctor Name:</b> {registration?.doctorName || "N/A"} <br />
        </div>
        <div>
          <b>Patient Name:</b> {patient?.patientName || "N/A"} <br />
          <b>DOB:</b>{" "}
          {patient?.dob ? new Date(patient.dob).toLocaleDateString("en-GB") : "N/A"} <br />
          <b>Age:</b> {patient?.age || "N/A"} <br />
          <b>Gender:</b> {patient?.gender || "N/A"} <br />
          <b>Medical Officer:</b> {currentUser?.name || "N/A"}
        </div>
      </div>

      {/* Tabs */}
      <div className="card-body">
        <ul className="nav nav-pills mb-3">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "mainComplaint" ? "active" : ""}`}
              onClick={() => setActiveTab("mainComplaint")}
            >
              Main Complaint
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "services" ? "active" : ""}`}
              onClick={() => setActiveTab("services")}
            >
              Services Advised
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "prescription" ? "active" : ""}`}
              onClick={() => setActiveTab("prescription")}
            >
              Prepare Prescription
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "diet" ? "active" : ""}`}
              onClick={() => setActiveTab("diet")}
            >
              Diet
            </button>
          </li>
        </ul>

        {/* Tab Content */}
        <div>
          {activeTab === "mainComplaint" && (
            <MainComplaint
              prescription={registrationData}
              templates={templates}
              addTemplate={() => setShowTemplateModal(true)}
            />
          )}
          {activeTab === "services" && (
            <ServicesAdvised doctorId={registration?.doctorID} />
          )}
          {activeTab === "prescription" && (
            <PreparePrescription
              patientId={patient?.patientID}
              regnId={registration?.regnID}
              existingPrescription={registrationData?.prescription}
            />
          )}
          {activeTab === "diet" && (
            <PatientDiet patientId={patient?.patientID} regnId={registration?.regnID} />
          )}
        </div>
      </div>

      {/* Template Modal */}
      {showTemplateModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h5>Add Template</h5>
            <input
              type="text"
              value={newTemplateName}
              onChange={(e) => setNewTemplateName(e.target.value)}
              placeholder="Enter template name"
            />
            <button onClick={addTemplate}>Save Template</button>
            <button onClick={() => setShowTemplateModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
