import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import "../styles/main.css";

function CoupleForm() {
  const coupleID = localStorage.getItem("coupleID");

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

  const [assessment, setAssessment] = useState(null);
  const [existingData, setExistingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!coupleID) {
      setChecking(false);
      return;
    }

    axios
      .get(`${process.env.REACT_APP_API_URL}/api/couple-assessment/${coupleID}`)
      .then((res) => {
        setExistingData(res.data);
        setAssessment(res.data.assessment);
      })
      .catch(() => {})
      .finally(() => {
        setChecking(false);
      });
  }, [coupleID]);

  const getRiskColor = (riskLevel) => {
    if (!riskLevel) return "#888";
    const level = riskLevel.toLowerCase();
    if (level.includes("critical")) return "#7b0000";
    if (level.includes("very high")) return "#b30000";
    if (level.includes("high")) return "#d94f00";
    if (level.includes("moderate") || level.includes("carrier"))
      return "#e08c00";
    return "#2e7d32";
  };

  const getRiskIcon = (riskLevel) => {
    if (!riskLevel) return "🧬";
    const level = riskLevel.toLowerCase();
    if (level.includes("critical") || level.includes("very high")) return "🔴";
    if (level.includes("high")) return "🟠";
    if (level.includes("moderate") || level.includes("carrier")) return "🟡";
    return "🟢";
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const missingFields = Object.keys(formData).filter(
      (key) => formData[key] === "",
    );
    if (missingFields.length > 0) {
      alert("Please fill in all fields before submitting.");
      return;
    }
    if (!coupleID) {
      alert("Session expired. Please log in again.");
      return;
    }

    const persons = [
      {
        coupleID,
        fullName: formData.husbandFullName,
        role: "Husband",
        dob: formData.husbandDOB,
        gender: "Male",
        region: formData.husbandRegion,
        bloodType: formData.husbandbloodtype,
        rhFactor: formData.husbandrhfactor,
        genotype: formData.husbandgenotype,
        familyHistory: parseInt(formData.HusbandfamilyHistory, 10),
        hasAffectedChild: parseInt(formData.affected, 10),
      },
      {
        coupleID,
        fullName: formData.wifeFullName,
        role: "Wife",
        dob: formData.wifeDOB,
        gender: "Female",
        region: formData.wifeRegion,
        bloodType: formData.wifebloodtype,
        rhFactor: formData.wiferhfactor,
        genotype: formData.wifegenotype,
        familyHistory: parseInt(formData.WifefamilyHistory, 10),
        hasAffectedChild: parseInt(formData.affected, 10),
      },
    ];

    setLoading(true);
    setAssessment(null);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/save-couple-data`,
        { coupleId: coupleID, persons },
      );

      if (response.status === 200) {
        const result = response.data.assessment;
        setAssessment(result);
        setExistingData({
          assessment: result,
          husband: persons[0],
          wife: persons[1],
        });
        setTimeout(
          () =>
            document
              .getElementById("result-card")
              ?.scrollIntoView({ behavior: "smooth" }),
          100,
        );
      }
    } catch (error) {
      alert("Failed to save data. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-100 border-t-red-700 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading your data...</p>
        </div>
      </div>
    );
  }

  const ResultCard = ({ assessmentData, husband, wife }) => (
    <div
      id="result-card"
      className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden"
    >
      <div
        style={{ backgroundColor: getRiskColor(assessmentData.riskLevel) }}
        className="p-6 text-white"
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl">
            {getRiskIcon(assessmentData.riskLevel)}
          </span>
          <div>
            <p className="text-xs uppercase opacity-80 tracking-widest">
              Assessment Result
            </p>
            <h3 className="text-xl font-bold">{assessmentData.riskLevel}</h3>
          </div>
        </div>
      </div>
      <div className="p-6 sm:p-8">
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase">
              Risk Probability
            </span>
            <span
              style={{ color: getRiskColor(assessmentData.riskLevel) }}
              className="text-xl font-black"
            >
              {assessmentData.probability}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              style={{
                width: `${assessmentData.probability}%`,
                backgroundColor: getRiskColor(assessmentData.riskLevel),
              }}
              className="h-full rounded-full transition-all duration-1000"
            />
          </div>
        </div>
        <div className="p-4 bg-red-50 border-l-4 border-red-700 rounded mb-6 text-sm text-gray-700">
          <p className="font-bold uppercase text-xs mb-1 text-gray-500">
            Recommendation
          </p>
          {assessmentData.recommendation}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[husband, wife].map((p, i) => (
            <div key={i} className="bg-gray-50 p-4 rounded text-center">
              <p className="text-[10px] text-gray-400 uppercase">{p?.role}</p>
              <p className="text-sm font-bold text-gray-700">{p?.fullName}</p>
              <p className="text-xl font-black text-red-700">
                {p?.genotype.toUpperCase()}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            to="/chatbot"
            className="inline-block px-6 py-3 bg-red-700 text-white rounded-lg font-bold shadow-lg hover:bg-red-900 transition"
          >
            💬 Discuss Results with AI Counselor
          </Link>
        </div>
      </div>
    </div>
  );

  if (existingData && assessment) {
    return (
      <div className="min-h-screen p-6 sm:p-12 flex flex-col items-center">
        <div className="max-w-2xl w-full bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded mb-8">
          <p className="font-bold text-yellow-800">Form Locked</p>
          <p className="text-sm text-yellow-700">
            Your genetic assessment is already submitted.
          </p>
        </div>
        <ResultCard
          assessmentData={existingData.assessment}
          husband={existingData.husband}
          wife={existingData.wife}
        />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex justify-center items-center p-4">
        <div className="w-full max-w-3xl bg-white p-6 sm:p-10 rounded-2xl shadow-xl">
          <h2 className="text-red-700 text-2xl font-bold mb-2">
            Couple Genetic Compatibility
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Analyze the probability of passing sickle cell disease to children.
          </p>

          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              name="husbandFullName"
              placeholder="Husband Full Name"
              onChange={handleChange}
              className="p-3 border rounded w-full"
            />
            <input
              type="text"
              name="wifeFullName"
              placeholder="Wife Full Name"
              onChange={handleChange}
              className="p-3 border rounded w-full"
            />
            <input
              type="text"
              name="husbandDOB"
              placeholder="Husband DOB"
              onFocus={(e) => (e.target.type = "date")}
              onChange={handleChange}
              className="p-3 border rounded w-full"
              required
            />
            <input
              type="text"
              name="wifeDOB"
              placeholder="Wife DOB"
              onFocus={(e) => (e.target.type = "date")}
              onChange={handleChange}
              className="p-3 border rounded w-full"
              required
            />
            <select
              name="husbandRegion"
              onChange={handleChange}
              className="p-3 border rounded w-full"
            >
              <option value="">Husband's Region</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <option key={n} value={n}>
                  Region {n}
                </option>
              ))}
            </select>
            <select
              name="wifeRegion"
              onChange={handleChange}
              className="p-3 border rounded w-full"
            >
              <option value="">Wife's Region</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <option key={n} value={n}>
                  Region {n}
                </option>
              ))}
            </select>
            <select
              name="husbandbloodtype"
              onChange={handleChange}
              className="p-3 border rounded w-full"
            >
              <option value="">Husband Blood Type</option>
              <option value="O">O</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="AB">AB</option>
            </select>
            <select
              name="wifebloodtype"
              onChange={handleChange}
              className="p-3 border rounded w-full"
            >
              <option value="">Wife Blood Type</option>
              <option value="O">O</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="AB">AB</option>
            </select>
            <select
              name="husbandrhfactor"
              onChange={handleChange}
              className="p-3 border rounded w-full"
            >
              <option value="">Husband Rh</option>
              <option value="+">+</option>
              <option value="-">-</option>
            </select>
            <select
              name="wiferhfactor"
              onChange={handleChange}
              className="p-3 border rounded w-full"
            >
              <option value="">Wife Rh</option>
              <option value="+">+</option>
              <option value="-">-</option>
            </select>
            <select
              name="husbandgenotype"
              onChange={handleChange}
              className="p-3 border rounded w-full"
            >
              <option value="">Husband Genotype</option>
              <option value="AA">AA</option>
              <option value="AS">AS</option>
              <option value="SS">SS</option>
            </select>
            <select
              name="wifegenotype"
              onChange={handleChange}
              className="p-3 border rounded w-full"
            >
              <option value="">Wife Genotype</option>
              <option value="AA">AA</option>
              <option value="AS">AS</option>
              <option value="SS">SS</option>
            </select>
            <select
              name="HusbandfamilyHistory"
              onChange={handleChange}
              className="p-3 border rounded w-full"
            >
              <option value="">Husband Family Affected?</option>
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>
            <select
              name="WifefamilyHistory"
              onChange={handleChange}
              className="p-3 border rounded w-full"
            >
              <option value="">Wife Family Affected?</option>
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>
            <select
              name="affected"
              onChange={handleChange}
              className="md:col-span-2 p-3 border rounded w-full"
            >
              <option value="">Do you have an affected child together?</option>
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>
            <button
              type="submit"
              className="md:col-span-2 bg-red-700 text-white p-4 rounded font-bold hover:bg-red-900 transition"
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Submit Form"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CoupleForm;
