import React, { useState } from "react";
import "../individual/styles/revoke_access.css";
import { ethers } from "ethers";
import { contractAddress, contractABI } from "../config";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const RevokeAccess = () => {
  const [recipientAddress, setRecipientAddress] = useState("");
  const navigate = useNavigate();

  const handleRevokeAccess = async () => {
    if (!window.ethereum) {
      toast.warning("Please install MetaMask");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const tx = await contract.revokeAccess(recipientAddress);
      await tx.wait();
    
      toast.success("Access revoked from "+recipientAddress);
    } catch (error) {
      console.error("Revoke Access Error:", error);
      toast.error("Failed to revoke access.");
    }
  };

  return (
    <div className="Dashboard">
      <aside className="sidebar">
        <ul>
          <li onClick={() => window.location.href = '/individual-dashboard'}>Profile</li>
          <li onClick={() => window.location.href = '/preferences'}>Update Preferences</li>
          <li onClick={() => window.location.href = '/grant-access'}>Grant Access</li>
          <li className="active" onClick={() => window.location.href = '/revoke-access'}>Revoke Access</li>
          <li onClick={() => window.location.href = '/pending-requests'}>Pending Requests</li>
          <li onClick={() => window.location.href='/users-with-access'}>Users with Access</li>

        </ul>
        <button className="logout" onClick={() => navigate("/welcome")}>Logout</button>
      </aside>

      <div className="dashboard-main">
        <nav className="navbar">
          <h2 className="nav-title">Revoke Access</h2>
        </nav>

        <main className="content">
          <p>Enter the wallet address you want to revoke access from:</p>
          <input
            className="input-address"
            type="text"
            placeholder="0x..."
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
          />
          <button className="update-btn" onClick={handleRevokeAccess}>Revoke Access</button>
        </main>
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

export default RevokeAccess;
