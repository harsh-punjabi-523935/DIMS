import React, { useState } from "react";
import { ethers } from "ethers";
import { contractAddress, contractABI } from "../config";
import "../corporate/styles/request_access.css";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const RequestAccess = () => {
  const [ownerAddress, setOwnerAddress] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [emailSent, setEmailSent] = useState(false);


  const sendEmail = async (to, subject, message) => {
    try {
      const response = await axios.post('http://localhost:5000/send-email', {
        to, subject, message
      });

      if(response.data.success){
        setEmailSent(true);
        toast.success('Email sent successfully!');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Error sending email.');
    }
  };

  const handleRequestAccess = async () => {
    setMessage("");
    setError("");

    if (!ethers.isAddress(ownerAddress)) {
      toast.error("Invalid wallet address.");
      return;
    }

    try {
      if (!window.ethereum) throw new Error("MetaMask not detected.");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const signerAddress = await signer.getAddress();

      const userEmail = "shah1857@saskpolytech.ca"
      const data = await contract.getCorporateProfile(signerAddress); 
      const requesterName = data[0];
      const tx = await contract.requestAccess(ownerAddress);
      await tx.wait();

      toast.success("Access request sent successfully!");
      const subject = `Data Access Request from ${requesterName}`;

      const message = `
        <h2>Data Access Request</h2>
        <p><strong>${requesterName}</strong> is requesting access to your identity data.</p>
        <p>Requested Wallet Address: <strong>${ownerAddress}</strong></p>
        <p><a href="http://localhost:5173/pending-requests">Click here to review</a></p>
        `;
  
      await sendEmail(userEmail, subject, message);
      setOwnerAddress("");
    } catch (err) {
      console.error(err);
      const revertReason = err?.reason || "Failed to send access request.";
        toast.error(`❌ ${revertReason}`);
    }
  };

  return (
    <div className="request-dashboard">
      <aside className="sidebar">
      <ul>
          <li onClick={() => navigate('/corporate-dashboard')}>Dashboard</li>
          <li onClick={() => navigate('/search-identity')}>Search Identity</li>
          <li className="active">Request Access</li>
          <li onClick={() => navigate('/corporate-pending-requests')}>Pending Requests</li>
          <li onClick={() => navigate('/approved-access')}>Approved Access</li>
          <li onClick={() => navigate('/corporate-profile')}>Organization Profile</li>

        </ul>
        <button className="logout" onClick={() => console.log("Logout clicked")}>Logout</button>
      </aside>

      <div className="request-container">
        <h2>Request Data Access</h2>
        <input
          type="text"
          placeholder="Enter wallet address"
          value={ownerAddress}
          onChange={(e) => setOwnerAddress(e.target.value)}
        />
        <button onClick={handleRequestAccess}>Request Access</button>

        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
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

export default RequestAccess;
