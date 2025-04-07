import React, { useState } from "react";
import "../individual/styles/individual_registration.css";
import { ethers } from "ethers";
import "../../../src/UnifiedIdentityABI.json"
import {contractAddress, contractABI} from "../config"; 
import { toast, ToastContainer } from "react-toastify";
 

const IndividualRegistration = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    id: "",
    phone: "",
    dob: "",
    gender: "",
    addressLine: "",
    profilePicHash: "",
    identityProofHash: "",
    occupation: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
	e.preventDefault()
    try {
      if (!window.ethereum) return toast.warning("Please install MetaMask");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
		
      const tx = await contract.registerIndividual(
        form.name,
        form.email,
        parseInt(form.id),
        form.phone,
        form.dob,
        form.gender,
        form.addressLine,
        form.profilePicHash,
        form.identityProofHash,
        form.occupation
      );
      await tx.wait();
      toast.success("Registration successful!");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed!");

    }
  };

  return (
    <div className="reg-container">
      <div className="reg-card">
        <h2>Individual Registration</h2>
        <form>
          <div className="reg-row">
            <input name="name" placeholder="Full Name" onChange={handleChange} required />
            <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
          </div>
          <div className="reg-row">
            <input name="id" placeholder="Government ID Number" onChange={handleChange} required />
            <input name="phone" placeholder="Phone Number" onChange={handleChange} required />
          </div>
          <div className="reg-row">
            <input name="dob" type="date" placeholder="Date of Birth" onChange={handleChange} required />
            <select name="gender" onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <input name="addressLine" placeholder="Address" onChange={handleChange} required />
          <input name="occupation" placeholder="Occupation" onChange={handleChange} required />
          <input name="profilePicHash" placeholder="Profile Picture Hash (IPFS)" onChange={handleChange} />
          <input name="identityProofHash" placeholder="Identity Proof Hash (IPFS)" onChange={handleChange} required />

          <button type="button" className="reg-btn" onClick={handleRegister}>Register</button>
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

export default IndividualRegistration;
