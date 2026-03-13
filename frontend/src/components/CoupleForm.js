import React, { useState } from "react";
import axios from "axios"; 
import Footer from "../components/Footer";
import "../styles/main.css";

function CoupleForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    wifefirstName: "",
    wifelastName: "",
    husbandRegion: "",
    wifeRegion: "",
    HusbandfamilyHistory: "",
    WifefamilyHistory: "",
    husbandStatus: "",
    wifeStatus: ""
  });

  const [result, setResult] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateRisk = async (e) => {
    e.preventDefault();

    //Calculate the result logic
    let message = "";
    const { husbandStatus, wifeStatus } = formData;

    if (husbandStatus === "normal" && wifeStatus === "normal") {
      message = "Child: 100% Normal";
    } else if ((husbandStatus === "normal" && wifeStatus === "carrier") || (husbandStatus === "carrier" && wifeStatus === "normal")) {
      message = "Child: 50% Carrier , 50% Normal";
    } else if ((husbandStatus === "normal" && wifeStatus === "infected") || (husbandStatus === "infected" && wifeStatus === "normal")) {
      message = "Child: 100% Carrier";
    } else if (husbandStatus === "carrier" && wifeStatus === "carrier") {
      message = "Child: 25% Infected , 50% Carrier , 25% Normal";
    } else if ((husbandStatus === "carrier" && wifeStatus === "infected") || (husbandStatus === "infected" && wifeStatus === "carrier")) {
      message = "Child: 50% Infected , 50% Carrier";
    } else if (husbandStatus === "infected" && wifeStatus === "infected") {
      message = "Child: 100% Infected";
    }

    setResult(message);

    //Send data to DB
    try {
      await axios.post("http://localhost:8081/add-case", {
        ...formData,
        riskResult: message
      });
      console.log("Case saved to database successfully");
    } catch (err) {
      console.error("Error saving case:", err);
    }
  };


return (
<div>
  <div className="form-wrapper">
  <div className="form-card">

  <h2>Couple Genetic Compatibility</h2>
  <p className="form-subtitle">
  Analyze the probability of passing sickle cell disease to children.
  </p>

  <form className="form-grid">

      <input
      type="text"
      name="firstName"
      placeholder="Husband First Name"
      onChange={handleChange}
      />

      <input
      type="text"
      name="lastName"
      placeholder="Husband Last Name"
      onChange={handleChange}
      />

      <input
      type="text"
      name="wifefirstName"
      placeholder="Wife First Name"
      onChange={handleChange}
      />

      <input
      type="text"
      name="wifelastName"
      placeholder="Wife Last Name"
      onChange={handleChange}
      />

      <select name="husbandRegion" onChange={handleChange}>
      <option value="">Husband Region</option>
      <option value="beirut">Beirut</option>
      <option value="mountLebanon">Mount Lebanon</option>
      <option value="bekaa">Bekaa</option>
      <option value="south">South</option>
      <option value="north">North</option>
      </select>

      <select name="wifeRegion" onChange={handleChange}>
      <option value="">Wife Region</option>
      <option value="beirut">Beirut</option>
      <option value="mountLebanon">Mount Lebanon</option>
      <option value="bekaa">Bekaa</option>
      <option value="south">South</option>
      <option value="north">North</option>
      </select>

      <textarea
      name="HusbandfamilyHistory"
      placeholder="Husband`s Family Medical History"
      onChange={handleChange}
      />

      <textarea
      name="WifefamilyHistory"
      placeholder="Wife`s Family Medical History"
      onChange={handleChange}
      />

      <select name="husbandStatus" onChange={handleChange}>
      <option value="">Husband Genetic Status</option>
      <option value="normal">Normal</option>
      <option value="carrier">Carrier</option>
      <option value="infected">Infected</option>
      </select>

      <select name="wifeStatus" onChange={handleChange}>
      <option value="">Wife Genetic Status</option>
      <option value="normal">Normal</option>
      <option value="carrier">Carrier</option>
      <option value="infected">Infected</option>
      </select>

      <button className="calculate-btn" onClick={calculateRisk}>
      Calculate Child Risk
      </button>

      </form>

      {result && (
      <div className="result-card">
      <h3>Genetic Risk Result</h3>
      <p>{result}</p>
      </div>
      )}

    </div>
  </div>
    <Footer />
  </div>
);
}

export default CoupleForm;