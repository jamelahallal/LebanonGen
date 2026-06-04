import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import { useTranslation } from "react-i18next";

const injectStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,700&family=Inter:wght@300;400;500;600&display=swap');
  .font-display { font-family: 'Cormorant Garamond', Georgia, serif; }
  .font-body    { font-family: 'Inter', sans-serif; }
  @keyframes pulse-dot { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:.45; transform:scale(.65); } }
  .animate-pulse-dot { animation: pulse-dot 2.2s infinite; }
  .login-grid-bg { background-image: linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px), linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px); background-size:52px 52px; }
  .login-radial { background: radial-gradient(ellipse 70% 60% at 50% 50%,rgba(220,38,38,0.45) 0%,transparent 75%); }
  .login-input { width:100%; background:#fafafa; border:1px solid #e5e7eb; border-radius:10px; padding:13px 16px;
    font-size:14px; font-family:'Inter',sans-serif; color:#111827; outline:none; transition:border-color 0.2s,box-shadow 0.2s,background 0.2s; }
  .login-input::placeholder { color:#9ca3af; }
  .login-input:focus { border-color:#b91c1c; background:#fff; box-shadow:0 0 0 3px rgba(185,28,28,0.08); }
  .login-btn { width:100%; background:#7f1d1d; color:white; font-family:'Inter',sans-serif; font-size:14px; font-weight:600;
    letter-spacing:0.04em; padding:14px; border-radius:10px; border:none; cursor:pointer; transition:background 0.2s,transform 0.15s; }
  .login-btn:hover { background:#991b1b; transform:translateY(-1px); }
  .login-btn:active { transform:translateY(0); }
  .divider-line { flex:1; height:1px; background:#e5e7eb; }
`;

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("coupleID", data.user.id);
        localStorage.setItem("userEmail", data.user.email);
        navigate("/form");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Connection error", error);
      alert("Server error. Please try again later.");
    }
  };

  return (
    <div className="font-body min-h-screen flex">
      <style>{injectStyles}</style>

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-[52%] relative bg-red-950 flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 login-grid-bg" />
        <div className="absolute inset-0 login-radial" />
        <div
          className="absolute rounded-full border border-white/[0.07] pointer-events-none"
          style={{
            width: 400,
            height: 400,
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        />
        <div
          className="absolute rounded-full border border-white/[0.04] pointer-events-none"
          style={{
            width: 680,
            height: 680,
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        />

        <div className="relative z-10 px-16 text-center max-w-md">
          <div
            className="inline-flex items-center gap-2.5 bg-white/10 border border-white/20
                          text-red-200 text-[10px] font-semibold tracking-[0.18em] uppercase
                          px-4 py-1.5 rounded-full mb-10"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-300 animate-pulse-dot" />
            {t("login.left.pill")}
          </div>
          <h2 className="font-display text-5xl xl:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6">
            {t("login.left.title1")}
            <br />
            <em className="not-italic text-red-200">
              {t("login.left.title2")}
            </em>
          </h2>
          <p className="text-white/50 text-sm font-light leading-relaxed mb-12">
            {t("login.left.subtitle")}
          </p>
          <div className="flex flex-col gap-4 text-left">
            {["trust1", "trust2", "trust3"].map((key, i) => {
              const icons = ["🔬", "🛡️", "🤝"];
              return (
                <div key={key} className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg bg-white/10 border border-white/15
                                  flex items-center justify-center text-sm shrink-0"
                  >
                    {icons[i]}
                  </div>
                  <span className="text-white/65 text-sm font-light">
                    {t(`login.left.${key}`)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="absolute bottom-10 left-0 right-0 px-16 text-center">
          <div
            className="divider-line mx-auto w-12 mb-4"
            style={{ background: "rgba(255,255,255,0.15)" }}
          />
          <p className="text-white/30 text-xs font-light tracking-wide italic">
            {t("login.left.quote")}
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex flex-col items-center justify-center bg-stone-50 px-6 py-12">
        <div className="lg:hidden mb-10 text-center">
          <div
            className="inline-flex items-center gap-2 bg-red-950 text-red-200 text-[10px]
                          font-semibold tracking-[0.18em] uppercase px-4 py-1.5 rounded-full mb-4"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-300 animate-pulse-dot" />
            LebanonGen
          </div>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="font-display text-4xl font-bold text-red-950 leading-tight mb-2">
              {t("login.form.title")}
            </h1>
            <p className="text-gray-400 text-sm font-light leading-relaxed">
              {t("login.form.subtitle")}
            </p>
          </div>

          <div className="flex items-center gap-3 mb-8">
            <div className="divider-line" />
            <span className="text-[10px] text-gray-400 tracking-[0.14em] uppercase font-medium shrink-0">
              {t("login.form.divider")}
            </span>
            <div className="divider-line" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 tracking-widest uppercase mb-2">
                {t("login.form.email_label")}
              </label>
              <input
                type="email"
                name="email"
                placeholder={t("login.form.email_placeholder")}
                onChange={handleChange}
                className="login-input"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 tracking-widest uppercase mb-2">
                {t("login.form.password_label")}
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                onChange={handleChange}
                className="login-input"
                required
              />
            </div>
            <div className="flex justify-end -mt-1">
              <a
                href="mailto:samer.fares@lebanongen.com"
                className="text-xs text-gray-400 hover:text-red-700 transition-colors duration-200 font-medium"
              >
                {t("login.form.forgot")}
              </a>
            </div>
            <button type="submit" className="login-btn mt-1">
              {t("login.form.submit")}
            </button>
          </form>

          <div className="mt-8 flex flex-col gap-3 text-center">
            <p className="text-sm text-gray-400 font-light">
              {t("login.form.no_account")}{" "}
              <a
                href="/register"
                className="text-red-800 font-semibold hover:text-red-600 transition-colors"
              >
                {t("login.form.register")}
              </a>
            </p>
            <a
              href="/reset"
              className="text-xs text-gray-400 hover:text-red-700 transition-colors font-medium"
            >
              {t("login.form.reset")}
            </a>
          </div>

          <div className="mt-10 pt-6 border-t border-gray-200 text-center">
            <p className="text-[11px] text-gray-300 font-light tracking-wide">
              {t("login.form.footer_note")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
