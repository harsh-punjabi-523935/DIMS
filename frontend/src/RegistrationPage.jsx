import React from "react";
import axios from "axios";
import "./registration_page.css"; // Custom styles
import { useState } from "react";

const Register = () => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          const response = await axios.post("http://localhost:5000/register", formData);
          alert(response.data.message);
          setFormData({ name: "", email: "", password: "" }); // Clear form after success
      } catch (error) {
          console.error("Registration error:", error);
          alert("Error registering user");
      }
  };


  return (
    <div className="register-container">
      <div className="register-box">
        <h2 className="text-center">Create Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input type="text" name="name" className="form-control" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <input type="email" name="email" className="form-control" placeholder="Your Email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <input type="password" name="password" className="form-control" placeholder="Password" value={formData.password} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <input type="password" className="form-control" placeholder="Repeat your password" required />
          </div>

          <div className="form-check text-start">
            <input type="checkbox" className="form-check-input" id="terms" />
            <label className="form-check-label" htmlFor="terms">
              I agree all statements in <a href="#">Terms of service</a>
            </label>
          </div>

          <button type="submit" className="btn btn-gradient">SIGN UP</button>
        </form>

        <p className="login-link">
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
