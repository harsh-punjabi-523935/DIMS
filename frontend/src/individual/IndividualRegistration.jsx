import React, { useState } from "react";
import "../individual/styles/individual_registration.css";
import { ethers } from "ethers";
import { contractAddress, contractABI } from "../config"; 
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // Import useNavigate

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

  const [profilePic, setProfilePic] = useState(null);
  const [identityProof, setIdentityProof] = useState(null);

  // Initialize useNavigate hook for redirection
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Function to upload file to Pinata
  const uploadToPinata = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("pinataOptions", '{"cidVersion": 1}');
    formData.append("pinataMetadata", '{"name": "profilePic"}');
    
    const PINATA_API_KEY = "c34a8f5e5a54cc5f7284";
    const PINATA_API_SECRET = "80e4479e428eed0838a2f0747c37b26ec4608c863e2e41ba1652c1320ffa383d";

    try {
      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS", 
        formData, 
        {
          headers: {
            pinata_api_key: PINATA_API_KEY,
            pinata_secret_api_key: PINATA_API_SECRET,
            "Content-Type": "multipart/form-data"
          }
        }
      );
      return res.data.IpfsHash;
    } catch (err) {
      console.error("Error uploading file to Pinata:", err);
      toast.error("File upload failed!");
    }
  };

  // Handle file selection for profile picture and identity proof
  const handleFileChange = async (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const fileHash = await uploadToPinata(file);

      if (type === "profilePic") {
        setForm({ ...form, profilePicHash: fileHash });
      } else if (type === "identityProof") {
        setForm({ ...form, identityProofHash: fileHash });
      }
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      if (!window.ethereum) return toast.warning("Please install MetaMask");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      // Proceed with the registration
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

      // Redirect to individual dashboard after successful registration
      navigate("/individual-dashboard");
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
          
          {/* File Upload Fields */}
          <p>Profile Picture</p>
          <input 
            type="file" 
            onChange={(e) => handleFileChange(e, "profilePic")} 
            accept="image/*"
          />

          <p>Identity Proof</p>
          <input 
            type="file" 
            onChange={(e) => handleFileChange(e, "identityProof")} 
            accept="application/pdf,image/*"
          />

          <button type="button" className="reg-btn" onClick={handleRegister}>Register</button>
        </form>

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
    </div>
  );
};

export default IndividualRegistration;
