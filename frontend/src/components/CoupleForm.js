import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import "../styles/main.css";
import { useTranslation } from "react-i18next";
import { translateMLResult } from "../utils/translateMLResult";

const injectStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,700&family=Inter:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; }
  .cf-body { font-family: 'Inter', sans-serif; background: #fafaf9; min-height: 100vh; }
  .cf-display { font-family: 'Cormorant Garamond', Georgia, serif; }
  @keyframes cf-spin { to { transform: rotate(360deg); } }
  @keyframes cf-fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes cf-pulse-dot { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:.4; transform:scale(.6); } }
  @keyframes cf-bar-grow { from { width: 0; } }
  .cf-fade-up { animation: cf-fadeUp 0.5s ease both; }
  .cf-pulse   { animation: cf-pulse-dot 2.2s infinite; }
  .cf-page { max-width: 960px; margin: 0 auto; padding: 48px 20px 80px; }
  .cf-page-header { text-align: center; margin-bottom: 40px; }
  .cf-badge { display: inline-flex; align-items: center; gap: 8px; background: #7f1d1d; color: #fecaca;
    font-size: 10px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase;
    padding: 5px 14px; border-radius: 999px; margin-bottom: 16px; }
  .cf-card { background: #fff; border-radius: 20px; border: 1px solid #f0e8e8;
    box-shadow: 0 4px 32px rgba(127,29,29,0.07); overflow: hidden; margin-bottom: 28px; }
  .cf-card-header { background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%); padding: 20px 28px;
    display: flex; align-items: center; gap: 14px; }
  .cf-card-icon { width: 40px; height: 40px; border-radius: 10px; background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center;
    font-size: 18px; flex-shrink: 0; }
  .cf-card-body { padding: 28px; }
  .cf-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  @media (max-width: 640px) { .cf-grid { grid-template-columns: 1fr; } .cf-span2 { grid-column: span 1 !important; } }
  .cf-span2 { grid-column: span 2; }
  .cf-label { display: block; font-size: 11px; font-weight: 600; color: #6b7280;
    letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 7px; }
  .cf-input, .cf-select { width: 100%; background: #fafafa; border: 1px solid #e5e7eb; border-radius: 10px;
    padding: 12px 14px; font-size: 14px; font-family: 'Inter', sans-serif; color: #111827; outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s; appearance: none; -webkit-appearance: none; }
  .cf-input::placeholder { color: #9ca3af; }
  .cf-input:focus, .cf-select:focus { border-color: #b91c1c; background: #fff; box-shadow: 0 0 0 3px rgba(185,28,28,0.08); }
  .cf-select-wrap { position: relative; }
  .cf-select-wrap::after { content: '▾'; position: absolute; right: 13px; top: 50%;
    transform: translateY(-50%); color: #9ca3af; pointer-events: none; font-size: 13px; }
  .cf-person-header { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 600;
    letter-spacing: 0.08em; text-transform: uppercase; color: #7f1d1d; margin-bottom: 16px;
    padding-bottom: 10px; border-bottom: 1px solid #f0e8e8; }
  .cf-person-dot { width: 8px; height: 8px; border-radius: 50%; background: #b91c1c; flex-shrink: 0; }
  .cf-divider { height: 1px; background: #f0e8e8; margin: 4px 0 20px; }
  .cf-submit { width: 100%; background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%); color: #fff;
    font-family: 'Inter', sans-serif; font-size: 15px; font-weight: 600; letter-spacing: 0.05em;
    padding: 15px; border-radius: 12px; border: none; cursor: pointer;
    box-shadow: 0 4px 16px rgba(127,29,29,0.35); display: flex; align-items: center;
    justify-content: center; gap: 10px; transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s; margin-top: 8px; }
  .cf-submit:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); box-shadow: 0 6px 22px rgba(127,29,29,0.4); }
  .cf-submit:active { transform: translateY(0); }
  .cf-submit:disabled { background: #d1d5db; box-shadow: none; cursor: not-allowed; }
  .cf-spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff; border-radius: 50%; animation: cf-spin 0.7s linear infinite; }
  .cf-notice { background: #fffbeb; border: 1px solid #fcd34d; border-left: 4px solid #f59e0b;
    border-radius: 10px; padding: 14px 20px; display: flex; align-items: flex-start; gap: 12px; margin-bottom: 28px; }
  .cf-notice-locked { background: #fef2f2; border: 1px solid #fca5a5; border-left: 4px solid #b91c1c;
    border-radius: 10px; padding: 14px 20px; display: flex; align-items: flex-start; gap: 12px; margin-bottom: 28px; }
  .cf-result { background: #fff; border-radius: 20px; border: 1px solid #f0e8e8;
    box-shadow: 0 8px 40px rgba(127,29,29,0.1); overflow: hidden; animation: cf-fadeUp 0.5s ease both; }
  .cf-result-header { padding: 24px 32px; display: flex; align-items: center; gap: 14px; }
  .cf-result-body { padding: 28px 32px; }
  .cf-prob-bar-track { background: #f0e8e8; border-radius: 999px; height: 10px; overflow: hidden; margin-top: 8px; }
  .cf-prob-bar-fill { height: 100%; border-radius: 999px; animation: cf-bar-grow 1.2s cubic-bezier(.22,1,.36,1) both; animation-delay: 0.3s; }
  .cf-rec-box { border-radius: 10px; padding: 16px 20px; margin: 20px 0; }
  .cf-genotype-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 20px; }
  @media (max-width: 480px) { .cf-genotype-grid { grid-template-columns: 1fr; } }
  .cf-genotype-card { background: #fafaf9; border: 1px solid #e5e7eb; border-radius: 10px; padding: 14px 16px; text-align: center; }
  .cf-chat-link { display: inline-flex; align-items: center; gap: 8px;
    background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%); color: #fff; text-decoration: none;
    padding: 12px 24px; border-radius: 10px; font-size: 14px; font-weight: 600;
    box-shadow: 0 4px 14px rgba(127,29,29,0.3); transition: opacity 0.2s, transform 0.15s; }
  .cf-chat-link:hover { opacity: 0.9; transform: translateY(-1px); }
  .cf-loading-screen { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; gap: 16px; }
  .cf-big-spinner { width: 48px; height: 48px; border: 4px solid #f0e8e8; border-top-color: #b91c1c;
    border-radius: 50%; animation: cf-spin 0.8s linear infinite; }
`;

// ── Helpers (outside component so they never get recreated) ──
const getRiskColor = (riskLevel) => {
  if (!riskLevel) return "#888";
  const l = riskLevel.toLowerCase();
  if (l.includes("critical")) return "#7b0000";
  if (l.includes("very high")) return "#b30000";
  if (l.includes("high")) return "#d94f00";
  if (l.includes("moderate") || l.includes("carrier")) return "#e08c00";
  return "#2e7d32";
};

const getRiskIcon = (riskLevel) => {
  if (!riskLevel) return "🧬";
  const l = riskLevel.toLowerCase();
  if (l.includes("critical") || l.includes("very high")) return "🔴";
  if (l.includes("high")) return "🟠";
  if (l.includes("moderate") || l.includes("carrier")) return "🟡";
  return "🟢";
};

// ── Field & SelectWrap moved outside — fixes focus-loss bug ──
const Field = ({ label, children }) => (
  <div>
    <label className="cf-label">{label}</label>
    {children}
  </div>
);

const SelectWrap = ({ children }) => (
  <div className="cf-select-wrap">{children}</div>
);

// ── ResultCard moved outside — fixes focus-loss bug ──
const ResultCard = ({ assessmentData, husband, wife, t }) => {
  const { riskLevel, recommendation } = translateMLResult(assessmentData, t);
  const color = getRiskColor(assessmentData.riskLevel);

  return (
    <div id="result-card" className="cf-result">
      <div
        className="cf-result-header"
        style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
      >
        <span style={{ fontSize: 32 }}>
          {getRiskIcon(assessmentData.riskLevel)}
        </span>
        <div>
          <p
            style={{
              margin: 0,
              fontSize: 11,
              color: "rgba(255,255,255,0.75)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              fontFamily: "'Inter',sans-serif",
            }}
          >
            {t("form.result_label")}
          </p>
          <h3
            className="cf-display"
            style={{ margin: 0, fontSize: 26, fontWeight: 700, color: "#fff" }}
          >
            {riskLevel}
          </h3>
        </div>
      </div>

      <div className="cf-result-body">
        {/* Probability bar */}
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 6,
            }}
          >
            <span
              style={{
                fontSize: 11,
                color: "#9ca3af",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {t("form.risk_probability")}
            </span>
            <span style={{ fontSize: 22, fontWeight: 800, color }}>
              {assessmentData.probability}%
            </span>
          </div>
          <div className="cf-prob-bar-track">
            <div
              className="cf-prob-bar-fill"
              style={{
                width: `${assessmentData.probability}%`,
                background: `linear-gradient(90deg, ${color}, ${color}99)`,
              }}
            />
          </div>
        </div>

        {/* Recommendation */}
        <div
          className="cf-rec-box"
          style={{
            background: "#fdf5f5",
            border: `1px solid ${color}33`,
            borderLeft: `4px solid ${color}`,
          }}
        >
          <p
            style={{
              margin: "0 0 6px",
              fontSize: 11,
              color: "#9ca3af",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            {t("form.recommendation_label")}
          </p>
          <p
            style={{
              margin: 0,
              fontSize: 15,
              color: "#374151",
              lineHeight: 1.65,
            }}
          >
            {recommendation}
          </p>
        </div>

        {/* Genotype cards */}
        <div className="cf-genotype-grid">
          {[
            { label: t("form.husband"), data: husband },
            { label: t("form.wife"), data: wife },
          ].map(({ label, data }) => (
            <div key={label} className="cf-genotype-card">
              <p
                style={{
                  margin: 0,
                  fontSize: 10,
                  color: "#9ca3af",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  fontWeight: 600,
                }}
              >
                {label}
              </p>
              <p
                style={{ margin: "4px 0 2px", fontSize: 13, color: "#6b7280" }}
              >
                {data?.fullName || "—"}
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: 26,
                  fontWeight: 800,
                  color: "#7f1d1d",
                  fontFamily: "'Cormorant Garamond', serif",
                }}
              >
                {(data?.genotype || "").toUpperCase()}
              </p>
            </div>
          ))}
        </div>

        {/* Date */}
        {assessmentData.createdAt && (
          <p
            style={{
              marginTop: 20,
              fontSize: 12,
              color: "#d1d5db",
              textAlign: "center",
            }}
          >
            {t("form.submitted_on")}{" "}
            {new Date(assessmentData.createdAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        )}
        <p
          style={{
            margin: "8px 0 24px",
            fontSize: 12,
            color: "#9ca3af",
            textAlign: "center",
            lineHeight: 1.6,
          }}
        >
          {t("form.disclaimer")}
        </p>
        <div style={{ textAlign: "center" }}>
          <Link to="/chatbot" className="cf-chat-link">
            <span>💬</span> {t("form.chat_link")}
          </Link>
        </div>
      </div>
    </div>
  );
};

// ── Region data (outside component — static, no need to recreate) ──
const regionKeys = [
  "beirut",
  "mount_lebanon",
  "keserwan",
  "north",
  "akkar",
  "bekaa",
  "baalbek",
  "south",
  "nabatieh",
];
const regionValues = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

function CoupleForm() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") !== "true") navigate("/login");
  }, [navigate]);

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
      .finally(() => setChecking(false));
  }, [coupleID]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const missingFields = Object.keys(formData).filter(
      (k) => formData[k] === "",
    );
    if (missingFields.length > 0) {
      alert(t("form.fill_all"));
      return;
    }
    if (!coupleID) {
      alert(t("form.session_expired"));
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
        { coupleID: coupleID, persons },
      );
      if (response.status === 200) {
        const result = response.data.assessment;
        setAssessment(result);
        setExistingData({
          assessment: result,
          husband: persons.find((p) => p.role === "Husband"),
          wife: persons.find((p) => p.role === "Wife"),
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
      console.error("Error saving data:", error);
      alert(t("form.save_error"));
    } finally {
      setLoading(false);
    }
  };

  // ── Loading screen ──
  if (checking)
    return (
      <>
        <style>{injectStyles}</style>
        <div className="cf-body">
          <div className="cf-loading-screen">
            <div className="cf-big-spinner" />
            <p
              style={{
                color: "#9ca3af",
                fontSize: 14,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {t("form.loading")}
            </p>
          </div>
        </div>
      </>
    );

  // ── Existing result view (form locked) ──
  if (existingData && assessment)
    return (
      <>
        <style>{injectStyles}</style>
        <div className="cf-body">
          <div className="cf-page">
            <div className="cf-page-header cf-fade-up">
              <div className="cf-badge">
                <span
                  className="cf-pulse"
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#fca5a5",
                    display: "inline-block",
                  }}
                />
                LebanonGen
              </div>
              <h1
                className="cf-display"
                style={{
                  fontSize: 42,
                  fontWeight: 700,
                  color: "#7f1d1d",
                  lineHeight: 1.1,
                  margin: 0,
                }}
              >
                {t("form.locked_title")}
              </h1>
            </div>

            <div className="cf-notice-locked cf-fade-up">
              <span style={{ fontSize: 18 }}>🔒</span>
              <div>
                <p
                  style={{
                    margin: 0,
                    fontWeight: 700,
                    color: "#7f1d1d",
                    fontSize: 14,
                  }}
                >
                  {t("form.locked_title")}
                </p>
                <p
                  style={{
                    margin: "4px 0 0",
                    color: "#991b1b",
                    fontSize: 13,
                    fontWeight: 300,
                  }}
                >
                  {t("form.locked_body")}
                </p>
              </div>
            </div>

            <ResultCard
              assessmentData={existingData.assessment}
              husband={existingData.husband}
              wife={existingData.wife}
              t={t}
            />
          </div>
          <Footer />
        </div>
      </>
    );

  // ── Main form view ──
  return (
    <>
      <style>{injectStyles}</style>
      <div className="cf-body">
        <div className="cf-page">
          {/* Page header */}
          <div className="cf-page-header cf-fade-up">
            <div className="cf-badge">
              <span
                className="cf-pulse"
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#fca5a5",
                  display: "inline-block",
                }}
              />
              {t("form.badge")}
            </div>
            <h1
              className="cf-display"
              style={{
                fontSize: 42,
                fontWeight: 700,
                color: "#7f1d1d",
                lineHeight: 1.1,
                margin: "0 0 10px",
              }}
            >
              {t("form.title")}
            </h1>
            <p
              style={{
                color: "#9ca3af",
                fontSize: 15,
                fontWeight: 300,
                margin: 0,
              }}
            >
              {t("form.subtitle")}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* ── PERSONAL INFORMATION ── */}
            <div className="cf-card cf-fade-up">
              <div className="cf-card-header">
                <div className="cf-card-icon">👤</div>
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 17,
                      fontWeight: 700,
                      color: "#fff",
                      fontFamily: "'Cormorant Garamond', serif",
                    }}
                  >
                    {t("form.section_personal")}
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 12,
                      color: "rgba(255,255,255,0.65)",
                      fontWeight: 300,
                    }}
                  >
                    {t("form.section_personal_sub")}
                  </p>
                </div>
              </div>
              <div className="cf-card-body">
                {/* Husband */}
                <div className="cf-person-header">
                  <div className="cf-person-dot" />
                  {t("form.husband")}
                </div>
                <div className="cf-grid" style={{ marginBottom: 24 }}>
                  <Field
                    label={`${t("form.husband")}'s ${t("form.full_name")}`}
                  >
                    <input
                      name="husbandFullName"
                      value={formData.husbandFullName}
                      onChange={handleChange}
                      className="cf-input"
                      placeholder={t("form.full_name")}
                    />
                  </Field>
                  <Field label={`${t("form.husband")}'s ${t("form.dob")}`}>
                    <input
                      type="date"
                      name="husbandDOB"
                      value={formData.husbandDOB}
                      onChange={handleChange}
                      className="cf-input"
                    />
                  </Field>
                  <Field label={`${t("form.husband")}'s ${t("form.region")}`}>
                    <SelectWrap>
                      <select
                        name="husbandRegion"
                        value={formData.husbandRegion}
                        onChange={handleChange}
                        className="cf-select"
                      >
                        <option value="">{t("form.select")}</option>
                        {regionKeys.map((key, i) => (
                          <option key={key} value={regionValues[i]}>
                            {t(`form.regions.${key}`)}
                          </option>
                        ))}
                      </select>
                    </SelectWrap>
                  </Field>
                </div>

                <div className="cf-divider" />

                {/* Wife */}
                <div className="cf-person-header">
                  <div className="cf-person-dot" />
                  {t("form.wife")}
                </div>
                <div className="cf-grid">
                  <Field label={`${t("form.wife")}'s ${t("form.full_name")}`}>
                    <input
                      name="wifeFullName"
                      value={formData.wifeFullName}
                      onChange={handleChange}
                      className="cf-input"
                      placeholder={t("form.full_name")}
                    />
                  </Field>
                  <Field label={`${t("form.wife")}'s ${t("form.dob")}`}>
                    <input
                      type="date"
                      name="wifeDOB"
                      value={formData.wifeDOB}
                      onChange={handleChange}
                      className="cf-input"
                    />
                  </Field>
                  <Field label={`${t("form.wife")}'s ${t("form.region")}`}>
                    <SelectWrap>
                      <select
                        name="wifeRegion"
                        value={formData.wifeRegion}
                        onChange={handleChange}
                        className="cf-select"
                      >
                        <option value="">{t("form.select")}</option>
                        {regionKeys.map((key, i) => (
                          <option key={key} value={regionValues[i]}>
                            {t(`form.regions.${key}`)}
                          </option>
                        ))}
                      </select>
                    </SelectWrap>
                  </Field>
                </div>
              </div>
            </div>

            {/* ── BLOOD TYPE ── */}
            <div className="cf-card cf-fade-up">
              <div className="cf-card-header">
                <div className="cf-card-icon">🩸</div>
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 17,
                      fontWeight: 700,
                      color: "#fff",
                      fontFamily: "'Cormorant Garamond', serif",
                    }}
                  >
                    {t("form.section_blood")}
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 12,
                      color: "rgba(255,255,255,0.65)",
                      fontWeight: 300,
                    }}
                  >
                    {t("form.section_blood_sub")}
                  </p>
                </div>
              </div>
              <div className="cf-card-body">
                <div className="cf-grid">
                  <Field
                    label={`${t("form.husband")}'s ${t("form.blood_type")}`}
                  >
                    <SelectWrap>
                      <select
                        name="husbandbloodtype"
                        value={formData.husbandbloodtype}
                        onChange={handleChange}
                        className="cf-select"
                      >
                        <option value="">{t("form.select")}</option>
                        {["O", "A", "B", "AB"].map((t_) => (
                          <option key={t_} value={t_}>
                            {t_}
                          </option>
                        ))}
                      </select>
                    </SelectWrap>
                  </Field>
                  <Field label={`${t("form.wife")}'s ${t("form.blood_type")}`}>
                    <SelectWrap>
                      <select
                        name="wifebloodtype"
                        value={formData.wifebloodtype}
                        onChange={handleChange}
                        className="cf-select"
                      >
                        <option value="">{t("form.select")}</option>
                        {["O", "A", "B", "AB"].map((t_) => (
                          <option key={t_} value={t_}>
                            {t_}
                          </option>
                        ))}
                      </select>
                    </SelectWrap>
                  </Field>
                  <Field
                    label={`${t("form.husband")}'s ${t("form.rh_factor")}`}
                  >
                    <SelectWrap>
                      <select
                        name="husbandrhfactor"
                        value={formData.husbandrhfactor}
                        onChange={handleChange}
                        className="cf-select"
                      >
                        <option value="">{t("form.select")}</option>
                        <option value="+">{t("form.positive")}</option>
                        <option value="-">{t("form.negative")}</option>
                      </select>
                    </SelectWrap>
                  </Field>
                  <Field label={`${t("form.wife")}'s ${t("form.rh_factor")}`}>
                    <SelectWrap>
                      <select
                        name="wiferhfactor"
                        value={formData.wiferhfactor}
                        onChange={handleChange}
                        className="cf-select"
                      >
                        <option value="">{t("form.select")}</option>
                        <option value="+">{t("form.positive")}</option>
                        <option value="-">{t("form.negative")}</option>
                      </select>
                    </SelectWrap>
                  </Field>
                </div>
              </div>
            </div>

            {/* ── GENETIC DATA ── */}
            <div className="cf-card cf-fade-up">
              <div className="cf-card-header">
                <div className="cf-card-icon">🧬</div>
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 17,
                      fontWeight: 700,
                      color: "#fff",
                      fontFamily: "'Cormorant Garamond', serif",
                    }}
                  >
                    {t("form.section_genetic")}
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 12,
                      color: "rgba(255,255,255,0.65)",
                      fontWeight: 300,
                    }}
                  >
                    {t("form.section_genetic_sub")}
                  </p>
                </div>
              </div>
              <div className="cf-card-body">
                <div className="cf-grid">
                  <Field label={`${t("form.husband")}'s ${t("form.genotype")}`}>
                    <SelectWrap>
                      <select
                        name="husbandgenotype"
                        value={formData.husbandgenotype}
                        onChange={handleChange}
                        className="cf-select"
                      >
                        <option value="">{t("form.select")}</option>
                        <option value="AA">{t("form.aa_normal")}</option>
                        <option value="AS">{t("form.as_carrier")}</option>
                        <option value="SS">{t("form.ss_affected")}</option>
                      </select>
                    </SelectWrap>
                  </Field>
                  <Field label={`${t("form.wife")}'s ${t("form.genotype")}`}>
                    <SelectWrap>
                      <select
                        name="wifegenotype"
                        value={formData.wifegenotype}
                        onChange={handleChange}
                        className="cf-select"
                      >
                        <option value="">{t("form.select")}</option>
                        <option value="AA">{t("form.aa_normal")}</option>
                        <option value="AS">{t("form.as_carrier")}</option>
                        <option value="SS">{t("form.ss_affected")}</option>
                      </select>
                    </SelectWrap>
                  </Field>
                  <Field
                    label={`${t("form.husband")}'s ${t("form.family_history")}`}
                  >
                    <SelectWrap>
                      <select
                        name="HusbandfamilyHistory"
                        value={formData.HusbandfamilyHistory}
                        onChange={handleChange}
                        className="cf-select"
                      >
                        <option value="">
                          {t("form.family_history_q_husband")}
                        </option>
                        <option value="1">{t("form.yes")}</option>
                        <option value="0">{t("form.no")}</option>
                      </select>
                    </SelectWrap>
                  </Field>
                  <Field
                    label={`${t("form.wife")}'s ${t("form.family_history")}`}
                  >
                    <SelectWrap>
                      <select
                        name="WifefamilyHistory"
                        value={formData.WifefamilyHistory}
                        onChange={handleChange}
                        className="cf-select"
                      >
                        <option value="">
                          {t("form.family_history_q_wife")}
                        </option>
                        <option value="1">{t("form.yes")}</option>
                        <option value="0">{t("form.no")}</option>
                      </select>
                    </SelectWrap>
                  </Field>
                  <div className="cf-span2">
                    <Field label={t("form.affected_child")}>
                      <SelectWrap>
                        <select
                          name="affected"
                          onChange={handleChange}
                          className="cf-select"
                        >
                          <option value="">{t("form.select")}</option>
                          <option value="1">{t("form.yes")}</option>
                          <option value="0">{t("form.no")}</option>
                        </select>
                      </SelectWrap>
                    </Field>
                  </div>
                </div>
              </div>
            </div>

            {/* ── SUBMIT ── */}
            <button
              type="submit"
              className="cf-submit cf-fade-up"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="cf-spinner" />
                  <span>{t("form.analyzing")}</span>
                </>
              ) : (
                <>
                  <span>{t("form.submit")}</span>
                  <span style={{ fontSize: 18 }}>→</span>
                </>
              )}
            </button>
          </form>

          {assessment && existingData && (
            <div style={{ marginTop: 40 }}>
              <ResultCard
                assessmentData={existingData.assessment}
                husband={existingData.husband}
                wife={existingData.wife}
                t={t}
              />
            </div>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}

export default CoupleForm;
