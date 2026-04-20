import React, { useState } from "react";
import axios from "axios";
import Footer from "../components/Footer";
import "../styles/main.css";

function CoupleForm() {
  const coupleId = localStorage.getItem("coupleId");

  const [formData, setFormData] = useState({
    husbandFullName: "",
    husbandDOB: "",
    husbandRegion: "",
    husbandbloodtype: "",
    husbandrhfactor: "",
    husbandgenotype: "",
    HusbandfamilyHistory: "",
    wifeFullName: "",
    wifeDOB: "",
    wifeRegion: "",
    wifebloodtype: "",
    wiferhfactor: "",
    wifegenotype: "",
    WifefamilyHistory: "",
    affected: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validation Logic
    const missingFields = Object.keys(formData).filter(
      (key) => formData[key] === "",
    );

    if (missingFields.length > 0) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    // 2. Session Check
    if (!coupleId) {
      alert("Session expired. Please log in again.");
      window.location.href = "/login";
      return;
    }

    // 3. Format data for backend
    // Backend expects an array of person objects
    const persons = [
      {
        fullName: formData.husbandFullName,
        role: "Husband",
        dob: formData.husbandDOB,
        gender: "Male",
        region: parseInt(formData.husbandRegion),
        bloodType: formData.husbandbloodtype,
        rhFactor: formData.husbandrhfactor,
        genotype: formData.husbandgenotype,
        familyHistory: formData.HusbandfamilyHistory,
        hasAffectedChild: formData.affected === "yes" ? 1 : 0,
      },
      {
        fullName: formData.wifeFullName,
        role: "Wife",
        dob: formData.wifeDOB,
        gender: "Female",
        region: parseInt(formData.wifeRegion),
        bloodType: formData.wifebloodtype,
        rhFactor: formData.wiferhfactor,
        genotype: formData.wifegenotype,
        familyHistory: formData.WifefamilyHistory,
        hasAffectedChild: formData.affected === "yes" ? 1 : 0,
      },
    ];

    try {
      const response = await axios.post(
        "http://localhost:5000/api/save-couple-data",
        {
          coupleId: coupleId,
          persons: persons,
        },
      );

      if (response.status === 200) {
        alert(response.data.message || "Assessment submitted successfully!");
        // Optional: redirect to a results page or reset form
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert(
        "Failed to save data. Please check if your Backend and Flask servers are running.",
      );
    }
  };

  return (
    <div>
      <div className="form-wrapper">
        <div className="form-card" style={{ maxWidth: "800px" }}>
          <h2 style={{ color: "#b30000" }}>Couple Genetic Compatibility</h2>
          <p className="form-subtitle">
            Analyze the probability of passing sickle cell disease to children.
          </p>

          <form className="form-grid" onSubmit={handleSubmit}>
            {/* Name Fields */}
            <input
              type="text"
              name="husbandFullName"
              placeholder="Husband Full Name"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="wifeFullName"
              placeholder="Wife Full Name"
              onChange={handleChange}
              required
            />

            {/* DOB Fields */}
            <input
              type="text"
              name="husbandDOB"
              placeholder="Husband's Date of Birth"
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => {
                if (e.target.value === "") e.target.type = "text";
              }}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="wifeDOB"
              placeholder="Wife's Date of Birth"
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => {
                if (e.target.value === "") e.target.type = "text";
              }}
              onChange={handleChange}
              required
            />

            {/* Region Selection */}
            <select name="husbandRegion" onChange={handleChange} required>
              <option value="">Husband's Region</option>
              <option value="1">Beirut</option>
              <option value="2">Mount Lebanon</option>
              <option value="3">Keserwan-Jbeil</option>
              <option value="4">North</option>
              <option value="5">Akkar</option>
              <option value="6">Bekaa</option>
              <option value="7">Baalbek-Hermel</option>
              <option value="8">South</option>
              <option value="9">Nabatieh</option>
            </select>

            <select name="wifeRegion" onChange={handleChange} required>
              <option value="">Wife's Region</option>
              <option value="1">Beirut</option>
              <option value="2">Mount Lebanon</option>
              <option value="3">Keserwan-Jbeil</option>
              <option value="4">North</option>
              <option value="5">Akkar</option>
              <option value="6">Bekaa</option>
              <option value="7">Baalbek-Hermel</option>
              <option value="8">South</option>
              <option value="9">Nabatieh</option>
            </select>

            {/* Blood Type Selection */}
            <select name="husbandbloodtype" onChange={handleChange} required>
              <option value="">Husband's Blood Type</option>
              <option value="O">O</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="AB">AB</option>
            </select>

            <select name="wifebloodtype" onChange={handleChange} required>
              <option value="">Wife's Blood Type</option>
              <option value="O">O</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="AB">AB</option>
            </select>

            {/* Rh Factor Selection */}
            <select name="husbandrhfactor" onChange={handleChange} required>
              <option value="">Husband's Rh Factor</option>
              <option value="+">+</option>
              <option value="-">-</option>
            </select>

            <select name="wiferhfactor" onChange={handleChange} required>
              <option value="">Wife's Rh Factor</option>
              <option value="+">+</option>
              <option value="-">-</option>
            </select>

            {/* Genotype Fields */}
            <select name="husbandgenotype" onChange={handleChange} required>
              <option value="">Husband's Genotype</option>
              <option value="AA">AA</option>
              <option value="AS">AS</option>
              <option value="SS">SS</option>
            </select>

            <select name="wifegenotype" onChange={handleChange} required>
              <option value="">Wife's Genotype</option>
              <option value="AA">AA</option>
              <option value="AS">AS</option>
              <option value="SS">SS</option>
            </select>

            {/* History and Affected Child */}
            <textarea
              name="HusbandfamilyHistory"
              placeholder="Husband's Family Medical History"
              onChange={handleChange}
              required
            />
            <textarea
              name="WifefamilyHistory"
              placeholder="Wife's Family Medical History"
              onChange={handleChange}
              required
            />

            <select
              name="affected"
              onChange={handleChange}
              style={{ gridColumn: "span 2" }}
              required
            >
              <option value="">Do you have an affected child?</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>

            <button
              type="submit"
              className="submit-btn"
              style={{ gridColumn: "span 2" }}
            >
              Submit Form
            </button>

            <div className="form-footer" style={{ gridColumn: "span 2" }}>
              <p>
                Get AI help?
                <a href="/chatbot" className="register-link">
                  {" "}
                  Click Here
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CoupleForm;
