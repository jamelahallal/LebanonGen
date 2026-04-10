import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import "../styles/main.css";

function Drlog() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "doctor"
  });
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // FIX: Add /admin to the URL path
      const response = await axios.post("http://localhost:5000/api/admin/doctor-login", formData);
      
      if (response.status === 200) {
        localStorage.setItem("drToken", response.data.token);
        localStorage.setItem("drRole", response.data.role);
        
        alert(`Welcome, Dr. ${response.data.name}`); // Use response.data.name from DB
        navigate("/doctor-dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(error.response?.data?.message || "Login failed. Please check your credentials.");
    }
};

  return (
    <div>
      <div className="form-wrapper">
        <div className="form-card" style={{ maxWidth: "450px" }}>
          <h2 style={{ color: "#b30000" }}>Medical Staff Portal</h2>
          <p className="form-subtitle">Access the genetic analysis dashboard.</p>

          <form className="form-grid" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Full Name (e.g., Dr. Smith)"
              onChange={handleChange}
              required
              style={{ gridColumn: "span 2" }}
            />
            
            <input
              type="email"
              name="email"
              placeholder="Professional Email"
              onChange={handleChange}
              required
              style={{ gridColumn: "span 2" }}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              style={{ gridColumn: "span 2" }}
            />

            <select 
              name="role" 
              onChange={handleChange} 
              style={{ gridColumn: "span 2" }}
              className="form-select"
            >
              <option value="doctor">Medical Doctor</option>
              <option value="admin">System Administrator</option>
            </select>

            <button type="submit" className="submit-btn" style={{ gridColumn: "span 2" }}>
              Login to Portal
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Drlog;