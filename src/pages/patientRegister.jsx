import React, { useState } from "react";
import Step1Personal from "../steps/Step1Personal";
import Step2Address from "../steps/Step2Address";
import Step3Other from "../steps/Step3Other";
import { registerPatient } from "../api/apiService";

export default function PatientRegister() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const [formData, setFormData] = useState({
    salutation: "",
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    mobile: "",
    email: "",
    bloodGroup: "",
    dob: "",
    ageYears: 0,
    weight: 0,
    height: 0,
    resAddress: "",
    resCountry: "India",
    resState: "",
    resDistrict: "",
    resTaluka: "",
    resCity: "",
    resPincode: "",
    sameAsResidential: true,
    permAddress: "",
    permCountry: "India",
    permState: "",
    permDistrict: "",
    permTaluka: "",
    permCity: "",
    permPincode: "",
    idProof: "",
    proofNumber: "",
    reasonOfVisit: "",
    vaccineFlag: "",
    assignDoctor: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => setFile(e.target.files[0] || null);
  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

 const handleSubmit = async () => {
  // Basic validation
  if (!formData.salutation || !formData.firstName || !formData.gender || !formData.ageYears) {
    alert("Please fill all required fields (Salutation, First Name, Gender, Age)");
    return;
  }

  setLoading(true);

  try {
    const payload = {
      Registration: {
        RegnID: 0,
        PatientID: 0,
        TokenNo: "0",
        RegnDateAndTime: new Date().toISOString(),
        DoctorID: parseInt(formData.assignDoctor) || 0,
        VaccineID: 0,
        ReasonID: parseInt(formData.reasonOfVisit) || 0,
        ProofID: 0,
        Status: 1,
        CreatedByUserID: "615cfb1f-ec0e-483d-8256-c782b38f23bc",
      },
      Patient: {
        PatientID: 0,
        SalutationID: parseInt(formData.salutation) || 1,
        PatientName: [formData.firstName, formData.middleName, formData.lastName].filter(Boolean).join(' ') || "NA",
        Age: parseInt(formData.ageYears) || 0,
        Gender: formData.gender || "Male",
        MobileNo: formData.mobile || "0",
        EmailID: formData.email || "0",
        DOB: formData.dob ? new Date(formData.dob).toISOString() : "2025-01-01T00:00:00",
        Weight: parseFloat(formData.weight) || 0,
        Height: parseFloat(formData.height) || 0,
        BloodGroupID: 0,
        ProofId: 0,
        ProofNumber: formData.proofNumber || "0",
        CreatedByUserID: "615cfb1f-ec0e-483d-8256-c782b38f23bc",
        CreatedDate: new Date().toISOString(),
      },
      Address: {
        AddressID: 0,
        RegnID: 0,
        Address: formData.resAddress || "0",
        City: formData.resCity || "0",
        Taluka: formData.resTaluka || "0",
        District: formData.resDistrict || "0",
        State: formData.resState || "0",
        Country: "India",
        Pincode: parseInt(formData.resPincode) || 0,
        IsPermAddSame: formData.sameAsResidential,
        PAddress: formData.sameAsResidential ? formData.resAddress || "0" : formData.permAddress || "0",
        PCity: formData.sameAsResidential ? formData.resCity || "0" : formData.permCity || "0",
        PTaluka: formData.sameAsResidential ? formData.resTaluka || "0" : formData.permTaluka || "0",
        PDistrict: formData.sameAsResidential ? formData.resDistrict || "0" : formData.permDistrict || "0",
        PState: formData.sameAsResidential ? formData.resState || "0" : formData.permState || "0",
        PCountry: formData.sameAsResidential ? "India" : formData.permCountry || "India",
        PPinCode: formData.sameAsResidential ? parseInt(formData.resPincode) || 0 : parseInt(formData.permPincode) || 0,
        CreatedByUserID: "615cfb1f-ec0e-483d-8256-c782b38f23bc",
      },
      PtPictureDto: {
        RegID: 0,
        PicturePath: "",
        CreationDateTime: new Date().toISOString(),
        IsDeleted: false,
        CreatedByUserID: "615cfb1f-ec0e-483d-8256-c782b38f23bc",
      },
    };

    // ---------- Flatten payload like Angular ----------
    const formDataToSend = new FormData();

    const appendKeysToFormData = (formDataObj, obj, parentKey = '') => {
      Object.entries(obj).forEach(([key, val]) => {
        const formKey = parentKey ? `${parentKey}.${key}` : key;
        if (key === 'ImageFile' && file) {
          formDataObj.append(`PtPictureDto.ImageFile`, file);
        } else if (val instanceof File) {
          formDataObj.append(formKey, val);
        } else if (val && typeof val === 'object') {
          appendKeysToFormData(formDataObj, val, formKey);
        } else {
          formDataObj.append(formKey, val ?? '');
        }
      });
    };

    appendKeysToFormData(formDataToSend, payload);

    if (file) formDataToSend.append('PtPictureDto.ImageFile', file);

    // ---------- Send API request ----------
    const res = await registerPatient(formDataToSend);
    alert("✅ Registration Successful!");
    console.log(res.data);

  } catch (err) {
    console.error("❌ Registration Failed:", err.response?.data || err);
    alert("Registration Failed. Check console for details.");
  } finally {
    setLoading(false);
  }
};


  switch (step) {
    case 1:
      return <Step1Personal formData={formData} handleChange={handleChange} nextStep={nextStep} />;
    case 2:
      return <Step2Address formData={formData} handleChange={handleChange} nextStep={nextStep} prevStep={prevStep} />;
    case 3:
      return <Step3Other formData={formData} handleChange={handleChange} prevStep={prevStep} handleFileChange={handleFileChange} handleSubmit={handleSubmit} loading={loading} />;
    default:
      return <div>Unknown step</div>;
  }
}
