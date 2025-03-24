import React, { useState } from "react";
import axios from "axios";
import "./business_login_page.css"; // Create this file for styles
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate


const BusinessLoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password_hash: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/org-login", formData);
      if (response.data.success) { 
        alert("Login successful");
        navigate("/dashboard"); // Redirect to Dashboard
      } else {
        alert("Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      alert("Invalid email or password");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="text-center">Business Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password_hash"
              className="form-control"
              placeholder="Password"
              value={formData.password_hash}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-gradient">LOGIN</button>
        </form>

        <p className="register-link">
          Don't have an account? <a href="/business-registration">Sign up here</a>
        </p>
      </div>
    </div>
  );
};

export default BusinessLoginPage;
