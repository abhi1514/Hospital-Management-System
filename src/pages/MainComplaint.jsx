// src/pages/MainComplaint.jsx
import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  getAllInstructions,
  insertOrUpdateInstruction,
  // add your save function here if available, e.g. savePatientHistory
} from "../api/apiService";

export default function MainComplaint({ initialData = {}, onSave }) {
  const [templates, setTemplates] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");

  // initialize default chief complaint row if none provided
  const defaultChief = { chief_Complaints: "", duration: 1, durationType: "day", isDeleted: false };

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      tempId: initialData.tempId || "",
      medical_name: initialData.medical_name || localStorage.getItem("username") || "",
      cheifComplaints: initialData.cheifComplaints || [defaultChief],
      extraChiefComplaints: initialData.extraChiefComplaints || "",
      extraDesc: initialData.extraDesc || "",
      temperature: initialData.temperature || "",
      pulse: initialData.pulse || "",
      bp: initialData.bp || "",
      pallor: initialData.pallor || "",
      clubbing: initialData.clubbing || "",
      lymph_adenopathy: initialData.lymph_adenopathy || "",
      icterus: initialData.icterus || "",
      oedema: initialData.oedema || "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "cheifComplaints",
  });

  // load templates (instructions used as templates in your backend)
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const res = await getAllInstructions();
        setTemplates(res.data || []);
      } catch (err) {
        console.error("Failed to fetch templates:", err);
      }
    };
    loadTemplates();
  }, []);

  // Template selection: populate chiefComplaints with template's text
  const handleTemplateChange = (e) => {
    const id = e.target.value;
    setValue("tempId", id);
    if (!id) return;
    const tpl = templates.find((t) => String(t.instructionId) === String(id));
    if (tpl) {
      const row = {
        chief_Complaints: tpl.descriptionEN || tpl.descriptionMarathi || "",
        duration: 1,
        durationType: "day",
        isDeleted: false,
      };
      setValue("cheifComplaints", [row]);
    }
  };

  const addComplaint = () => append(defaultChief);
  const removeComplaint = (index) => {
    // ensure at least one row remains if you prefer:
    if (fields.length === 1) {
      // replace with empty row instead of deleting last
      setValue("cheifComplaints", [defaultChief]);
      return;
    }
    remove(index);
  };

  // Add new template via API
  const handleAddTemplate = async (e) => {
    e.preventDefault();
    if (!newTemplateName?.trim()) return;
    try {
      // call your API to insert the instruction (template)
      await insertOrUpdateInstruction({ descriptionEN: newTemplateName.trim() });
      // reload templates
      const res = await getAllInstructions();
      setTemplates(res.data || []);
      setNewTemplateName("");
      setShowModal(false);
    } catch (err) {
      console.error("Failed to save template:", err);
      alert("Failed to save template. Check console.");
    }
  };

  // Submit handler - call onSave prop or just log
  const onSubmit = async (data) => {
    console.log("Main Complaint form data:", data);
    // If you have an API to save history, call it here, e.g.
    // await savePatientHistory(data)
    // or use your existing API method
    if (onSave) {
      await onSave(data);
    } else {
      alert("Form ready. Check console for submitted data.");
    }
  };

  return (
    <div className="container mt-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Top row */}
        <div className="row mb-3">
          <div className="col-md-4">
            <label className="form-label">Template List</label>
            <select
              className="form-select"
              {...register("tempId")}
              onChange={handleTemplateChange}
              defaultValue=""
            >
              <option value="">Select Template</option>
              {templates.map((t) => (
                <option key={t.instructionId} value={t.instructionId}>
                  {t.descriptionEN || t.descriptionMarathi || `Template ${t.instructionId}`}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">Medical Officer Name</label>
            <input
              type="text"
              className="form-control"
              {...register("medical_name")}
              readOnly
            />
          </div>

          <div className="col-md-4 d-flex align-items-end">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowModal(true)}
            >
              Add Template
            </button>
          </div>
        </div>

        <hr />

        {/* Chief Complaints table */}
        <h5>Chief Complaints</h5>
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Sr. No.</th>
                <th>Chief Complaints</th>
                <th>Duration</th>
                <th>Type</th>
                <th>Select</th>
                <th>
                  <button type="button" className="btn btn-success btn-sm" onClick={addComplaint}>
                    +
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, i) => (
                <tr key={field.id}>
                  <td>{i + 1}</td>
                  <td>
                    <textarea
                      className="form-control"
                      {...register(`cheifComplaints.${i}.chief_Complaints`)}
                      defaultValue={field.chief_Complaints}
                    />
                  </td>
                  <td style={{ verticalAlign: "middle" }}>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      className="form-range"
                      {...register(`cheifComplaints.${i}.duration`, { valueAsNumber: true })}
                      defaultValue={field.duration ?? 1}
                    />
                    <div className="ms-2">
                      {watch(`cheifComplaints.${i}.duration`) ?? field.duration ?? 1}
                    </div>
                  </td>
                  <td>
                    <select
                      className="form-select"
                      {...register(`cheifComplaints.${i}.durationType`)}
                      defaultValue={field.durationType ?? "day"}
                    >
                      <option value="day">Day</option>
                      <option value="week">Week</option>
                      <option value="month">Month</option>
                      <option value="year">Year</option>
                    </select>
                  </td>
                  <td className="text-center">
                    <input type="checkbox" {...register(`cheifComplaints.${i}.isDeleted`)} />
                  </td>
                  <td className="text-center">
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => removeComplaint(i)}
                    >
                      -
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Extra / Desc */}
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Extra</label>
            <input className="form-control" {...register("extraChiefComplaints")} />
          </div>
          <div className="col-md-6">
            <label className="form-label">DESC</label>
            <input className="form-control" {...register("extraDesc")} />
          </div>
        </div>

        <hr />

        {/* On Examination */}
        <h5>On Examination</h5>
        <div className="row">
          <div className="col-md-4 mb-2">
            <label className="form-label">Temperature</label>
            <input className="form-control" {...register("temperature")} />
          </div>
          <div className="col-md-4 mb-2">
            <label className="form-label">Pulse</label>
            <input className="form-control" {...register("pulse")} />
          </div>
          <div className="col-md-4 mb-2">
            <label className="form-label">BP</label>
            <input className="form-control" {...register("bp")} />
          </div>
            <h5>General Exam</h5>
          <div className="col-md-4 mb-2">
            <label className="form-label">Pallor</label>
            <input className="form-control" {...register("pallor")} />
          </div>
          <div className="col-md-4 mb-2">
            <label className="form-label">Clubbing</label>
            <input className="form-control" {...register("clubbing")} />
          </div>
          <div className="col-md-4 mb-2">
            <label className="form-label">Lymph Adenopathy</label>
            <input className="form-control" {...register("lymph_adenopathy")} />
          </div>
          <div className="col-md-4 mb-2">
            <label className="form-label">Icterus</label>
            <input className="form-control" {...register("icterus")} />
          </div>
          <div className="col-md-4 mb-2">
            <label className="form-label">Oedema</label>
            <input className="form-control" {...register("oedema")} />
          </div>
        </div>

        <div className="text-end mt-3">
          <button type="submit" className="btn matstepbtn btn-primary">
            Save History
          </button>
        </div>
      </form>

      {/* Simple React modal (no external bootstrap JS required) */}
      {showModal && (
        <div className="modal-backdrop" style={{ zIndex: 1040 }}>
          <div
            className="modal d-block"
            tabIndex="-1"
            style={{ zIndex: 1050, display: "block" }}
            aria-modal="true"
            role="dialog"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add Template</h5>
                  <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowModal(false)} />
                </div>
                <div className="modal-body">
                  <form onSubmit={handleAddTemplate}>
                    <div className="mb-3">
                      <label className="form-label">Template Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newTemplateName}
                        onChange={(e) => setNewTemplateName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="d-flex justify-content-end gap-2">
                      <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Save Template
                      </button>
                    </div>
                  </form>
                </div>
                <div className="modal-footer" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
