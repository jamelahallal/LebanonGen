import React from "react";
import { Link } from "react-router-dom"; 
import logo from "../images/logo.png";
import "../styles/footer.css";

function Footer() {
  return (
    <footer className="footer">
      {/* Column 1: Brand Identity */}
      <div className="footer-column">
        <div className="footer-logo">
          <img src={logo} alt="LebanoGen Logo"/>
        </div>
      </div>

      {/* Column 2: Quick Links */}
      <div className="footer-column">
        <h4>Navigation</h4>
        <Link to="/">Home</Link>
        <Link to="/about">About Us</Link>
        <Link to="/form">Compatibility Form</Link>
        <Link to="/dashboard">Health Dashboard</Link>
      </div>

      {/* Column 3: Contact Info */}
      <div className="footer-column">
        <h4>Contact</h4>
        <p>📍 Beirut, Lebanon</p>
        <p>📧 sickle@LebanonGen.com</p>
        <p>📞 +961 71 123 456</p>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} LebanoGen — Sickle Cell Awareness & Prevention
      </div>
    </footer>
  );
}

export default Footer;