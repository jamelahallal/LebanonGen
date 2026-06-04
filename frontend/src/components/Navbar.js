import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { GiDna2 } from "react-icons/gi";
import { useTranslation } from "react-i18next";
import { applyDirection } from "../i18n/i18n";

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ar", label: "العربية", flag: "🇱🇧" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const currentLang =
    LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0];

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
  }, [location]);

  // Close lang dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("coupleID");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    navigate("/");
  };

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem("appLanguage", code);
    applyDirection(code);
    setLangOpen(false);
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <GiDna2 className="text-red-600 text-4xl" />
          <div className="flex flex-col leading-tight">
            <span className="text-xl font-bold text-gray-800">
              Lebanon<span className="text-red-600">Gen</span>
            </span>
            <span className="text-sm text-gray-500">{t("navbar.tagline")}</span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex space-x-8 text-gray-700 font-medium">
            <li>
              <Link
                to="/"
                className="hover:text-red-600 transition duration-300"
              >
                {t("navbar.home")}
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="hover:text-red-600 transition duration-300"
              >
                {t("navbar.about")}
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard"
                className="hover:text-red-600 transition duration-300"
              >
                {t("navbar.dashboard")}
              </Link>
            </li>
            <li>
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="hover:text-red-600 transition duration-300"
                >
                  {t("navbar.logout")}
                </button>
              ) : (
                <Link
                  to="/login"
                  className="hover:text-red-600 transition duration-300"
                >
                  {t("navbar.login")}
                </Link>
              )}
            </li>
          </ul>

          {/* ── Language Switcher ── */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200
                         text-sm font-medium text-gray-600 hover:border-red-300 hover:text-red-700
                         transition-all duration-200 bg-white shadow-sm"
              aria-label="Select language"
            >
              <span className="text-base">{currentLang.flag}</span>
              <span className="hidden lg:inline">{currentLang.label}</span>
              <svg
                className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {langOpen && (
              <div
                className="absolute top-full mt-2 right-0 bg-white border border-gray-100
                           rounded-xl shadow-xl overflow-hidden z-50 min-w-[150px]"
                style={{ animation: "fadeDown 0.15s ease" }}
              >
                <style>{`
                  @keyframes fadeDown {
                    from { opacity: 0; transform: translateY(-6px); }
                    to   { opacity: 1; transform: translateY(0); }
                  }
                `}</style>
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left
                               hover:bg-red-50 hover:text-red-700 transition-colors duration-150
                               ${i18n.language === lang.code ? "bg-red-50 text-red-700 font-semibold" : "text-gray-700"}`}
                  >
                    <span className="text-base">{lang.flag}</span>
                    <span>{lang.label}</span>
                    {i18n.language === lang.code && (
                      <svg
                        className="w-3.5 h-3.5 ml-auto text-red-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile right side: lang switcher + hamburger */}
        <div className="md:hidden flex items-center gap-3">
          {/* Mobile language quick-toggle (cycles through languages) */}
          <button
            onClick={() => {
              const idx = LANGUAGES.findIndex((l) => l.code === i18n.language);
              const next = LANGUAGES[(idx + 1) % LANGUAGES.length];
              changeLanguage(next.code);
            }}
            className="text-xl border border-gray-200 rounded-lg px-2 py-1 bg-white shadow-sm"
            aria-label="Switch language"
          >
            {currentLang.flag}
          </button>

          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
            {isOpen ? (
              <FaTimes className="text-2xl text-red-600" />
            ) : (
              <FaBars className="text-2xl text-red-600" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md">
          <ul className="py-4 px-6 space-y-4 text-gray-700 font-medium">
            <li>
              <Link to="/" onClick={() => setIsOpen(false)}>
                {t("navbar.home")}
              </Link>
            </li>
            <li>
              <Link to="/about" onClick={() => setIsOpen(false)}>
                {t("navbar.about")}
              </Link>
            </li>
            <li>
              <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                {t("navbar.dashboard")}
              </Link>
            </li>
            <li>
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                >
                  {t("navbar.logout")}
                </button>
              ) : (
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  {t("navbar.login")}
                </Link>
              )}
            </li>
          </ul>

          {/* Mobile full language switcher */}
          <div className="px-6 pb-4 border-t border-gray-100 pt-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
              Language
            </p>
            <div className="flex gap-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    changeLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border transition-all
                             ${
                               i18n.language === lang.code
                                 ? "bg-red-50 border-red-300 text-red-700 font-semibold"
                                 : "border-gray-200 text-gray-600 hover:border-red-200"
                             }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
