// src/api/apiService.js
import axios from "axios";

// const API_BASE = "http://patilsam-001-site1.anytempurl.com";

const API_BASE = "/api";
// Axios instance
const api = axios.create({
  baseURL: API_BASE,
});

// Add Authorization header automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ----------------- AUTH -----------------
export const loginUser = (username, password) =>
  api.post(`/api/User/LogIn?username=${username}&password=${password}`);

// ----------------- COMMON -----------------
export const getBloodGroups = () => api.get("/api/Common/GetAllBloodGroups");
export const getSalutations = () => api.get("/api/Common/GetSalutations");
export const getDoctors = () => api.get("/api/Doctor/GetAllDoctor");
export const getVaccines = () => api.get("/api/Common/GetAllVaccine");
export const getIdProofs = () => api.get("/api/Common/GetAllIdProofs");
export const getVisitReasons = () => api.get("/api/Common/GetVisitReason");

// ----------------- STATE/DISTRICT/TALUKA/CITY -----------------
export const getStates = () => api.get("/StateDistrict/states");
export const getDistricts = (state) => api.get(`/StateDistrict/districts?state=${state}`);
export const getTalukas = (district) => api.get(`/StateDistrict/talukas?district=${district}`);
export const getCities = (taluka) => api.get(`/StateDistrict/cities?taluka=${taluka}`);

// ----------------- PATIENT REGISTRATION -----------------
// ✅ Utility function: Object → FormData
export const appendFormData = (formData, data, parentKey = "") => {
  if (data && typeof data === "object" && !(data instanceof File)) {
    Object.keys(data).forEach((key) => {
      appendFormData(formData, data[key], parentKey ? `${parentKey}.${key}` : key);
    });
  } else {
    if (data !== null && data !== undefined) {
      formData.append(parentKey, data);
    }
  }
};

// ----------------- API Calls -----------------

export const registerPatient = (formData) =>
  api.post("/api/Registration/Registration", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getRegistrationById = (regnID) =>
  api.get(`/api/Registration/GetRegistrationById?regnID=${regnID}`);

// ----------------- PATIENTS -----------------

// Old getAllPatients (optional)
export const getAllPatients = (queryParams = {}) => {
  const queryString = new URLSearchParams(queryParams).toString();
  const url = queryString
    ? `/api/Registration/GetAllPatient?${queryString}`
    : `/api/Registration/GetAllPatient`;
  return api.get(url);
};

// ✅ New search API
export const searchPatients = (searchTerm = "") => {
  if (!searchTerm) return api.get(`/api/Registration/GetAllPatient`); // fallback to all patients
  return api.get(`/api/Registration/GetSearchRegistrationDetails/${encodeURIComponent(searchTerm)}`);
};



// ----------------- PRESCRIPTIONS -----------------

// 📌 Prescription Master APIs
export const getAllPrescriptions = () =>
  api.get("/api/Prescription/GetAllPrescriptions");

export const savePrescription = (payload) =>
  api.post("/api/Prescription/InsertOrUpdatePrescription", payload);


// ----------------- SERVICE ADVISOR -----------------
export const getAllServiceAdvisors = () =>
  api.get("/api/Test/GetServiceAdvisorDetailed");

export const saveServiceAdvisor = (payload) =>
  api.post("/api/Test/InsertOrUpdateServiceAdvisor", payload);

export const deleteAdvisorById = (id) =>
  api.delete(`/api/Test/DeleteServiceAdvisor/${id}`);



// 📌 Medicines
export const getAllMedicines = () =>
  api.get("/api/Prescription/GetAllMedicines");

export const insertOrUpdateMedicine = (payload) =>
  api.post("/api/Prescription/InsertOrUpdateMedicine", payload);

// 📌 Medicine Types
export const getAllMedicineTypes = () =>
  api.get("/api/Prescription/GetAllMedicineTypes");

export const insertOrUpdateMedicineType = (payload) =>
  api.post("/api/Prescription/InsertOrUpdateMedicineType", payload);

// 📌 Instructions
export const getAllInstructions = () =>
  api.get("/api/Prescription/GetAllInstructions");

export const insertOrUpdateInstruction = (payload) =>
  api.post("/api/Prescription/InsertOrUpdateInstruction", payload);

// src/api/apiService.js

export const getDepartment = () => api.get("/api/Test/GetDepartment");
export const getTestsByDepartment = (deptId) =>
  api.get(`/api/Test/GetTestsByDepartment/${deptId}`);


// src/api/apiService.js

// ✅ Patient Diet APIs
export const getPatientDietTemplate = () =>
  api.get("/api/Diet/GetPatientDietTemplate");

export const insertOrUpdatePatientDiet = (payload) =>
  api.post("/api/Diet/InsertUpdatePatientDiet", payload);

export const printPatientDiet = (payload) =>
  api.post("/api/Diet/PrintDiet", payload);


// ----------------- EXPORT DEFAULT -----------------
export default api;
