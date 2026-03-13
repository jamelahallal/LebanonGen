import React, { useState } from "react";
import "../styles/login.css";

function Login() {

  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="form-wrapper">
      <div className="form-card">

        <h2>Patient Portal Login</h2>
        <p className="form-subtitle">
          Register your profile to help us track and prevent sickle cell disease across Lebanon.
        </p>

        <form className="login-form-fields">

          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
          />

          <button type="submit" className="calculate-btn">
            Sign In
          </button>

        </form>

      </div>
    </div>
  );
}

export default Login;