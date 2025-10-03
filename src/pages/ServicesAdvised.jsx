// src/pages/ServicesAdvised.jsx
import React, { useEffect, useState } from "react";
import {
  getDepartment,
  getTestsByDepartment,
  getAllServiceAdvisors,
  saveServiceAdvisor,
  deleteAdvisorById,
} from "../api/apiService";

export default function ServicesAdvised() {
  const [departments, setDepartments] = useState([]);
  const [tests, setTests] = useState([]);
  const [advisors, setAdvisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    serviceAdvisorId: null,
    departmentId: "",
    testId: "",
    instructions: "",
    clinicalNotes: "",
    isUrgent: false,
  });

  const [isEditMode, setIsEditMode] = useState(false);

  // Fetch departments and advisors on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [deptRes, advisorRes] = await Promise.all([
          getDepartment(),
          getAllServiceAdvisors(),
        ]);
        setDepartments(deptRes.data || []);
        setAdvisors(advisorRes.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fetch tests when department changes
  const handleDepartmentChange = async (deptId) => {
    setFormData((prev) => ({ ...prev, departmentId: deptId, testId: "" }));
    if (!deptId) {
      setTests([]);
      return;
    }
    try {
      const res = await getTestsByDepartment(deptId);
      setTests(res.data || []);
    } catch (err) {
      console.error("Error fetching tests:", err);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Add or update advisor
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await saveServiceAdvisor(formData);
      // refresh advisors
      const res = await getAllServiceAdvisors();
      setAdvisors(res.data || []);
      resetForm();
      alert("Advisor saved successfully!");
    } catch (err) {
      console.error("Error saving advisor:", err);
      alert("Error saving advisor.");
    }
  };

  // Delete advisor
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this advisor?")) return;
    try {
      await deleteAdvisorById(id);
      setAdvisors((prev) => prev.filter((a) => a.serviceAdvisorId !== id));
      alert("Advisor deleted successfully!");
    } catch (err) {
      console.error("Error deleting advisor:", err);
      alert("Error deleting advisor.");
    }
  };

  // Edit advisor
  const handleEdit = (advisor) => {
    setFormData({
      serviceAdvisorId: advisor.serviceAdvisorId,
      departmentId: advisor.departmentId,
      testId: advisor.testId,
      instructions: advisor.instruction || "",
      clinicalNotes: advisor.clinicalNotes || "",
      isUrgent: advisor.urgent === "Yes",
    });
    handleDepartmentChange(advisor.departmentId);
    setIsEditMode(true);
  };

  const resetForm = () => {
    setFormData({
      serviceAdvisorId: null,
      departmentId: "",
      testId: "",
      instructions: "",
      clinicalNotes: "",
      isUrgent: false,
    });
    setIsEditMode(false);
    setTests([]);
  };

  // Filtered advisors for search
  const filteredAdvisors = advisors.filter(
    (a) =>
      a.departmentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.testName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p>Loading service advisors...</p>;

  return (
    <div className="container mt-4">
      <h4>Service Advisor Master</h4>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by Department or Test"
        className="form-control mb-3"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Add/Edit Form */}
      <div className="card p-3 mb-4">
        <h5>{isEditMode ? "Edit Advisor" : "Add Advisor"}</h5>
        <form onSubmit={handleSave}>
          <div className="row mb-2">
            <div className="col-md-4">
              <label className="form-label">Department</label>
              <select
                className="form-select"
                name="departmentId"
                value={formData.departmentId}
                onChange={(e) => handleDepartmentChange(e.target.value)}
                required
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.departmentId} value={dept.departmentId}>
                    {dept.departmentName}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Test</label>
              <select
                className="form-select"
                name="testId"
                value={formData.testId}
                onChange={handleChange}
                required
              >
                <option value="">Select Test</option>
                {tests.map((test) => (
                  <option key={test.testId} value={test.testId}>
                    {test.testName}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4 d-flex align-items-end gap-2">
              <button type="submit" className="btn btn-primary">
                {isEditMode ? "Update" : "Add"}
              </button>
              {isEditMode && (
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </div>

          <div className="mb-2">
            <label className="form-label">Instructions</label>
            <textarea
              className="form-control"
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
            />
          </div>

          <div className="mb-2">
            <label className="form-label">Clinical Notes</label>
            <textarea
              className="form-control"
              name="clinicalNotes"
              value={formData.clinicalNotes}
              onChange={handleChange}
            />
          </div>

          <div className="form-check mb-2">
            <input
              type="checkbox"
              className="form-check-input"
              id="isUrgent"
              name="isUrgent"
              checked={formData.isUrgent}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="isUrgent">
              Is Urgent?
            </label>
          </div>
        </form>
      </div>

      {/* Advisors Table */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Department</th>
            <th>Test</th>
            <th>Instructions</th>
            <th>Clinical Notes</th>
            <th>Urgent</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAdvisors.map((advisor) => (
            <tr key={advisor.serviceAdvisorId}>
              <td>{advisor.serviceAdvisorId}</td>
              <td>{advisor.departmentName}</td>
              <td>{advisor.testName}</td>
              <td>{advisor.instruction}</td>
              <td>{advisor.clinicalNotes}</td>
              <td>{advisor.urgent}</td>
              <td>
                <button
                  className="btn btn-sm btn-primary me-1"
                  onClick={() => handleEdit(advisor)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(advisor.serviceAdvisorId)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {filteredAdvisors.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center">
                No advisors found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
