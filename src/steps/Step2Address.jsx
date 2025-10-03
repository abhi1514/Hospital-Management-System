import React, { useEffect, useState } from "react";
import { getStates, getDistricts, getTalukas, getCities } from "../api/apiService";

export default function Step2Address({ formData, handleChange, nextStep, prevStep }) {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [talukas, setTalukas] = useState([]);
  const [cities, setCities] = useState([]);

  const [permStates, setPermStates] = useState([]);
  const [permDistricts, setPermDistricts] = useState([]);
  const [permTalukas, setPermTalukas] = useState([]);
  const [permCities, setPermCities] = useState([]);

  // Fetch states on mount
  useEffect(() => {
    getStates()
      .then((res) => {
        setStates(res.data || []);
        setPermStates(res.data || []);
      })
      .catch(console.error);
  }, []);

  // Residential dropdowns
  useEffect(() => {
    if (formData.resState) {
      getDistricts(formData.resState).then((res) => setDistricts(res.data || []));
    }
  }, [formData.resState]);

  useEffect(() => {
    if (formData.resDistrict) {
      getTalukas(formData.resDistrict).then((res) => setTalukas(res.data || []));
    }
  }, [formData.resDistrict]);

  useEffect(() => {
    if (formData.resTaluka) {
      getCities(formData.resTaluka).then((res) => setCities(res.data || []));
    }
  }, [formData.resTaluka]);

  // Permanent dropdowns
  useEffect(() => {
    if (formData.permState) {
      getDistricts(formData.permState).then((res) => setPermDistricts(res.data || []));
    }
  }, [formData.permState]);

  useEffect(() => {
    if (formData.permDistrict) {
      getTalukas(formData.permDistrict).then((res) => setPermTalukas(res.data || []));
    }
  }, [formData.permDistrict]);

  useEffect(() => {
    if (formData.permTaluka) {
      getCities(formData.permTaluka).then((res) => setPermCities(res.data || []));
    }
  }, [formData.permTaluka]);

  // Handle "Same as Residential"
  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    handleChange({ target: { name: "sameAsResidential", value: checked } });

    if (checked) {
      handleChange({ target: { name: "permAddress", value: formData.resAddress } });
      handleChange({ target: { name: "permCity", value: formData.resCity } });
      handleChange({ target: { name: "permTaluka", value: formData.resTaluka } });
      handleChange({ target: { name: "permDistrict", value: formData.resDistrict } });
      handleChange({ target: { name: "permState", value: formData.resState } });
      handleChange({ target: { name: "permCountry", value: formData.resCountry } });
      handleChange({ target: { name: "permPincode", value: formData.resPincode } });
    }
  };

  const isNextDisabled = () => {
    if (!formData.resPincode || formData.resPincode.length !== 6) return true;
    if (!formData.sameAsResidential && (!formData.permPincode || formData.permPincode.length !== 6))
      return true;
    return false;
  };

  return (
    <div className="container mt-3">
      <h5>Step 2: Address Information</h5>

      {/* Residential */}
      <h6>Residential Address</h6>
      <div className="mb-3">
        <label>Address</label>
        <input type="text" name="resAddress" value={formData.resAddress} onChange={handleChange} className="form-control" />
      </div>

      <div className="mb-3">
        <label>State</label>
        <select name="resState" value={formData.resState} onChange={handleChange} className="form-control">
          <option value="">Select State</option>
          {states.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label>District</label>
        <select name="resDistrict" value={formData.resDistrict} onChange={handleChange} className="form-control">
          <option value="">Select District</option>
          {districts.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label>Taluka</label>
        <select name="resTaluka" value={formData.resTaluka} onChange={handleChange} className="form-control">
          <option value="">Select Taluka</option>
          {talukas.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label>City</label>
        <select name="resCity" value={formData.resCity} onChange={handleChange} className="form-control">
          <option value="">Select City</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label>Pin Code*</label>
        <input
          type="text"
          name="resPincode"
          value={formData.resPincode}
          onChange={handleChange}
          className="form-control"
          maxLength={6}
        />
      </div>

      <div className="form-check mb-3">
        <input type="checkbox" checked={formData.sameAsResidential} onChange={handleCheckboxChange} className="form-check-input" id="sameAsResidential" />
        <label className="form-check-label" htmlFor="sameAsResidential">
          Permanent Address is same as Residential Address
        </label>
      </div>

      {/* Permanent Address */}
      {!formData.sameAsResidential && (
        <div>
          <h6>Permanent Address</h6>
          <div className="mb-3">
            <label>Address</label>
            <input type="text" name="permAddress" value={formData.permAddress} onChange={handleChange} className="form-control" />
          </div>

          <div className="mb-3">
            <label>State</label>
            <select name="permState" value={formData.permState} onChange={handleChange} className="form-control">
              <option value="">Select State</option>
              {permStates.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label>District</label>
            <select name="permDistrict" value={formData.permDistrict} onChange={handleChange} className="form-control">
              <option value="">Select District</option>
              {permDistricts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label>Taluka</label>
            <select name="permTaluka" value={formData.permTaluka} onChange={handleChange} className="form-control">
              <option value="">Select Taluka</option>
              {permTalukas.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label>City</label>
            <select name="permCity" value={formData.permCity} onChange={handleChange} className="form-control">
              <option value="">Select City</option>
              {permCities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label>Pin Code*</label>
            <input type="text" name="permPincode" value={formData.permPincode} onChange={handleChange} className="form-control" maxLength={6} />
          </div>
        </div>
      )}

      <button className="btn btn-secondary me-2" onClick={prevStep}>
        Previous
      </button>
      <button className="btn btn-primary" onClick={nextStep} disabled={isNextDisabled()}>
        Next ➡️
      </button>
    </div>
  );
}
