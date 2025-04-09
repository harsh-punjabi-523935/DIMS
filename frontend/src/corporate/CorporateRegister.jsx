import React, { useState } from "react";
import "../individual/styles/individual_registration.css";
import { ethers } from "ethers";
import { contractAddress, corporateABI } from "../config";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const CorporateRegistration = () => {
    const navigate = useNavigate();
  const [form, setForm] = useState({
    orgName: "",
    email: "",
    registrationNumber: "",
    businessType: "",
    headquarters: "",
    contactPerson: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      if (!window.ethereum) return toast.error("Please install MetaMask");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, corporateABI, signer);

      const tx = await contract.registerCorporate(
        form.orgName,
        form.email,
        form.registrationNumber,
        form.businessType,
        form.headquarters,
        form.contactPerson
      );

      await tx.wait();
      toast.success("Corporate registration successful!");
      navigate("/corporate-dashboard");

    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed!");
    }
  };

  return (
    <div className="reg-container">
      <div className="reg-card">
        <h2>Corporate Registration</h2>
        <form onSubmit={handleRegister}>
          <div className="reg-row">
            <input name="orgName" placeholder="Organization Name" onChange={handleChange} required />
            <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
          </div>
          <div className="reg-row">
            <input name="registrationNumber" placeholder="Registration Number" onChange={handleChange} required />
            <input name="businessType" placeholder="Business Type" onChange={handleChange} required />
          </div>
          <input name="headquarters" placeholder="Headquarters Location" onChange={handleChange} required />
          <input name="contactPerson" placeholder="Primary Contact Person" onChange={handleChange} required />

          <button type="submit" className="reg-btn">Register</button>
        </form>
      </div>
      <ToastContainer 
                          position="top-right" 
                          autoClose={3000} 
                          hideProgressBar={false} 
                          newestOnTop={true} 
                          closeOnClick
                          pauseOnHover
                          theme="dark"
                        />
    </div>
  );
};

export default CorporateRegistration;
