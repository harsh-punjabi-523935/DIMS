import React, { useState } from "react";
import axios from "axios";
import "./business_registration_page.css";
import { useNavigate } from "react-router-dom";

const BusinessRegistrationPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    legal_name: "",
    industry: "",
    organization_size: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    business_type: "Private",
    registration_number: "",
    taxId: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/org-register", formData);
      alert(response.data.message);
      navigate("/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
      alert("Error registering organization");
    }
  };

  return (
    <div className="org-register-container">
      <div className="org-register-box">
        <h2>Register Your Organization</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input type="text" name="name" placeholder="Organization Name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <input type="text" name="legal_name" placeholder="Legal Name" value={formData.legal_name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <input type="text" name="industry" placeholder="Industry" value={formData.industry} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <input type="text" name="organization_size" placeholder="Organization Size" value={formData.organization_size} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <input type="email" name="email" placeholder="Official Email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <input type="text" name="phone" placeholder="Contact Number" value={formData.phone} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <input type="text" name="website" placeholder="Website URL" value={formData.website} onChange={handleChange} />
          </div>
          <div className="form-group">
            <input type="text" name="address" placeholder="Headquarters Address" value={formData.address} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="businessType" className="form-label">Business Type</label>
            <select
              name="business_type"
              id="businessType"
              className="form-control"
              value={formData.business_type}
              onChange={handleChange}
              required
            >
              <option value="Private">Private</option>
              <option value="Public">Public</option>
              <option value="Non-Profit">Non-Profit</option>
              <option value="Government">Government</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <input type="text" name="registration_number" placeholder="Registration Number" value={formData.registration_number} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <input type="text" name="tax_id" placeholder="Tax ID" value={formData.tax_id} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <input type="password" name="password" placeholder="Create Password" value={formData.password} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-gradient">REGISTER</button>
        </form>
      </div>
    </div>
  );
};

export default BusinessRegistrationPage;
