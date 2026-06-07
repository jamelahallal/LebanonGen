import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const PATIENT_PROTECTED = ["/form", "/chatbot"];
const ADMIN_PROTECTED   = ["/dashboard/consultant", "/dashboard/researcher", "/dashboard/admin"];
const PATIENT_PUBLIC_TRIGGERS = ["/", "/about", "/login", "/register", "/reset", "/drlog"];
const ADMIN_PUBLIC_TRIGGERS   = ["/", "/about", "/login", "/register", "/reset", "/drlog", "/form", "/chatbot"];

function clearPatientSession() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("coupleID");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("latestAssessmentData");
}

function clearAdminSession() {
  localStorage.removeItem("isAdminLoggedIn");
  localStorage.removeItem("doctorToken");
  localStorage.removeItem("drEmail");
  localStorage.removeItem("drRole");
}

export function useAutoLogout() {
  const navigate = useNavigate();
  const location = useLocation();
  const prevPath = useRef(location.pathname);

  useEffect(() => {
    const prev = prevPath.current;
    const curr = location.pathname;

    // ── Patient auto-logout ──
    const patientWasProtected = PATIENT_PROTECTED.some(p => prev.startsWith(p));
    const patientGoingPublic  = PATIENT_PUBLIC_TRIGGERS.some(p => curr === p || curr.startsWith(p));

    if (patientWasProtected && patientGoingPublic && localStorage.getItem("isLoggedIn") === "true") {
      clearPatientSession();
      navigate(curr);
    }

    // ── Admin auto-logout ──
    const adminWasProtected = ADMIN_PROTECTED.some(p => prev.startsWith(p));
    const adminGoingPublic  = ADMIN_PUBLIC_TRIGGERS.some(p => curr === p || curr.startsWith(p));

    if (adminWasProtected && adminGoingPublic && localStorage.getItem("isAdminLoggedIn") === "true") {
      clearAdminSession();
      navigate(curr);
    }

    prevPath.current = curr;
  }, [location.pathname, navigate]);
}