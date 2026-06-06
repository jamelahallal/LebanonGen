import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import "../styles/main.css";
import { useTranslation } from "react-i18next";

const injectStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,700&family=Inter:wght@300;400;500;600&display=swap');

  .dr-font-display { font-family: 'Cormorant Garamond', Georgia, serif; }
  .dr-font-body    { font-family: 'Inter', sans-serif; }

  @keyframes dr-pulse-dot {
    0%,100% { opacity:1; transform:scale(1); }
    50%      { opacity:.45; transform:scale(.65); }
  }
  .dr-animate-pulse { animation: dr-pulse-dot 2.2s infinite; }

  @keyframes dr-fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .dr-fade-up { animation: dr-fadeUp 0.55s ease both; }
  .dr-fade-up-1 { animation-delay: 0.05s; }
  .dr-fade-up-2 { animation-delay: 0.12s; }
  .dr-fade-up-3 { animation-delay: 0.19s; }
  .dr-fade-up-4 { animation-delay: 0.26s; }

  .dr-grid-bg {
    background-image:
      linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px);
    background-size: 56px 56px;
  }
  .dr-radial-glow {
    background: radial-gradient(ellipse 75% 65% at 50% 50%, rgba(153,27,27,0.45) 0%, transparent 75%);
  }

  .dr-input-field {
    width: 100%;
    background: #fafafa;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 14px 16px 14px 44px;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    color: #111827;
    outline: none;
    box-sizing: border-box;
    transition: all 0.2s ease;
  }
  .dr-input-field::placeholder { color: #9ca3af; }
  .dr-input-field:focus {
    border-color: #991b1b;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(153,27,27,0.08);
  }

  .dr-input-wrapper { position: relative; }
  .dr-input-icon-left {
    position: absolute; left: 16px; top: 50%;
    transform: translateY(-50%);
    color: #a3a3a3; font-size: 15px; pointer-events: none;
    transition: color 0.2s;
  }
  .dr-input-wrapper:focus-within .dr-input-icon-left { color: #991b1b; }

  .dr-btn {
    width: 100%;
    background: linear-gradient(135deg, #111827 0%, #1f2937 100%);
    color: #fff;
    font-family: 'Inter', sans-serif;
    font-size: 14px; font-weight: 600;
    letter-spacing: 0.03em;
    padding: 14px; border-radius: 10px;
    border: none; cursor: pointer;
    box-shadow: 0 4px 12px rgba(17,24,39,0.15);
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: all 0.2s ease;
  }
  .dr-btn:hover {
    background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(17,24,39,0.22);
  }
  .dr-btn:active { transform: translateY(0); }

  .dr-divider-line { flex: 1; height: 1px; background: #e5e7eb; }
`;

function Drlog() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/admin/doctor-login`,
        { email, password },
      );

      if (response.data.token) {
        localStorage.setItem("doctorToken", response.data.token);
        localStorage.setItem("doctorRole", response.data.role);
        localStorage.setItem("doctorName", response.data.name);

        const role = response.data.role;

        if (role === "admin") {
          navigate("/dashboard/admin");
        } else if (role === "doctor") {
          navigate("/dashboard/consultant");
        } else if (role === "researcher") {
          navigate("/dashboard/researcher");
        } else {
          setError("Unrecognized role. Please contact the administrator.");
        }
      }
    } catch (err) {
      setError(
        t("drlog.error_invalid") || "Invalid credentials. Please try again.",
      );
    }
  };

  return (
    <div
      className="dr-font-body"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#fcfcfc",
      }}
    >
      <style>{injectStyles}</style>

      <div style={{ flex: 1, display: "flex" }}>
        {/* Left Side Visual Banner */}
        <div
          className="dr-left-banner"
          style={{
            width: "48%",
            position: "relative",
            background: "#111827",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <div
            className="dr-grid-bg"
            style={{ position: "absolute", inset: 0 }}
          />
          <div
            className="dr-radial-glow"
            style={{ position: "absolute", inset: 0 }}
          />

          {/* Decorative Rings */}
          {[440, 720].map((size) => (
            <div
              key={size}
              style={{
                position: "absolute",
                borderRadius: "50%",
                border: `1px solid rgba(255,255,255,${size === 440 ? 0.05 : 0.02})`,
                width: size,
                height: size,
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                pointerEvents: "none",
              }}
            />
          ))}

          <div
            style={{
              position: "relative",
              zIndex: 10,
              padding: "0 64px",
              textAlign: "center",
              maxWidth: 460,
            }}
          >
            {/* Status Pill Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#fca5a5",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                padding: "6px 18px",
                borderRadius: 999,
                marginBottom: 32,
              }}
            >
              <span
                className="dr-animate-pulse"
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#ef4444",
                  display: "inline-block",
                }}
              />
              {t("login.left.pill")}
            </div>

            <h2
              className="dr-font-display"
              style={{
                fontSize: 46,
                fontWeight: 700,
                color: "#fff",
                lineHeight: 1.15,
                marginBottom: 20,
              }}
            >
              {t("login.left.title1")}
              <br />
              <em style={{ fontStyle: "normal", color: "#fca5a5" }}>
                {t("login.left.title2")}
              </em>
            </h2>

            <p
              style={{
                color: "rgba(255,255,255,0.45)",
                fontSize: 14,
                fontWeight: 300,
                lineHeight: 1.75,
              }}
            >
              {t("login.left.subtitle")}
            </p>
          </div>

          {/* Core Footer Note on Banner */}
          <div
            style={{
              position: "absolute",
              bottom: 40,
              left: 0,
              right: 0,
              textAlign: "center",
            }}
          >
            <p
              style={{
                color: "rgba(255,255,255,0.25)",
                fontSize: 11,
                fontStyle: "italic",
                fontWeight: 300,
              }}
            >
              {t("login.left.quote")}
            </p>
          </div>
        </div>

        {/* Right Side Authentication Interface */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "48px 32px",
          }}
        >
          {/* Mobile View App Badge header block */}
          <div
            className="dr-mobile-badge-container"
            style={{ marginBottom: 36, textAlign: "center" }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "#111827",
                color: "#fecaca",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                padding: "6px 16px",
                borderRadius: 999,
              }}
            >
              <span
                className="dr-animate-pulse"
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#ef4444",
                  display: "inline-block",
                }}
              />
              Lebanon Gene
            </div>
          </div>

          <div style={{ width: "100%", maxWidth: 360 }}>
            {/* Header Identity Typography */}
            <div
              className="dr-fade-up dr-fade-up-1"
              style={{ marginBottom: 32 }}
            >
              <h1
                className="dr-font-display"
                style={{
                  fontSize: 38,
                  fontWeight: 700,
                  color: "#111827",
                  lineHeight: 1.2,
                  marginBottom: 8,
                }}
              >
                {t("drlog.title")}
              </h1>
              <p
                style={{
                  color: "#6b7280",
                  fontSize: 14,
                  fontWeight: 300,
                  lineHeight: 1.6,
                }}
              >
                {t("drlog.subtitle")}
              </p>
            </div>

            {/* Micro Separation Rule */}
            <div
              className="dr-fade-up dr-fade-up-2"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 32,
              }}
            >
              <div className="dr-divider-line" />
              <span
                style={{
                  fontSize: 10,
                  color: "#9ca3af",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                }}
              >
                {t("login.form.divider")}
              </span>
              <div className="dr-divider-line" />
            </div>

            {/* Functional Input Form Element */}
            <form
              onSubmit={handleLogin}
              style={{ display: "flex", flexDirection: "column", gap: 20 }}
            >
              {error && (
                <div
                  className="dr-fade-up"
                  style={{
                    padding: "12px",
                    background: "#fef2f2",
                    border: "1px solid #fee2e2",
                    borderRadius: "8px",
                    color: "#991b1b",
                    fontSize: "13px",
                    fontWeight: 400,
                  }}
                >
                  {error}
                </div>
              )}

              <div className="dr-fade-up dr-fade-up-2">
                <label
                  style={{
                    display: "block",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#4b5563",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    marginBottom: 8,
                  }}
                >
                  {t("drlog.email_label")}
                </label>
                <div className="dr-input-wrapper">
                  <span className="dr-input-icon-left">✉</span>
                  <input
                    type="email"
                    placeholder={t("login.form.email_placeholder")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="dr-input-field"
                    required
                  />
                </div>
              </div>

              <div className="dr-fade-up dr-fade-up-3">
                <label
                  style={{
                    display: "block",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#4b5563",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    marginBottom: 8,
                  }}
                >
                  {t("drlog.password_label")}
                </label>
                <div className="dr-input-wrapper">
                  <span className="dr-input-icon-left">🔒</span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="dr-input-field"
                    required
                  />
                </div>
              </div>

              {/* Utility Auxiliary Option Route Link Block */}
              <div
                className="dr-fade-up dr-fade-up-3"
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "-4px",
                }}
              >
                <a
                  href="mailto:admin@lebanongene.com"
                  style={{
                    fontSize: 12,
                    color: "#9ca3af",
                    fontWeight: 500,
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  onMouseOver={(e) => (e.target.style.color = "#b91c1c")}
                  onMouseOut={(e) => (e.target.style.color = "#9ca3af")}
                >
                  {t("login.form.forgot")}
                </a>
              </div>

              <div className="dr-fade-up dr-fade-up-4">
                <button type="submit" className="dr-btn">
                  <span>{t("drlog.submit")}</span>
                </button>
              </div>
            </form>

            {/* Bottom note */}
            <div
              className="dr-fade-up dr-fade-up-4"
              style={{
                marginTop: 36,
                paddingTop: 24,
                borderTop: "1px solid #e5e7eb",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  color: "#d1d5db",
                  fontWeight: 300,
                  letterSpacing: "0.04em",
                }}
              >
                {t("login.form.footer_note")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Mobile badge show fix */}
      <style>{`
        @media (max-width: 1023px) {
          .dr-left-banner { display: none !important; }
          .dr-mobile-badge-container { display: block !important; }
        }
        @media (min-width: 1024px) {
          .dr-mobile-badge-container { display: none !important; }
        }
      `}</style>
    </div>
  );
}

export default Drlog;
