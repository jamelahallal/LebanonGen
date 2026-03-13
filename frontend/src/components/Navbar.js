import React from "react";
import { Link } from "react-router-dom";
import "../styles/home.css";
import logo from "../images/logo.png";

function Navbar() {
  return (
    <nav className="navbar">
      <img 
        className="nav-logo" 
        src={logo} 
        alt="LebanoGen Logo" 
        style={{ 
          width: "200px", 
          height: "auto", 
          marginTop: "0px" 
        }}
      />

      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/form">Couples Form</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/login">Login</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;