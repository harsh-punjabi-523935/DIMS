import React, { useState } from "react";
import "../individual/styles/grant_access.css";
import { ethers } from "ethers";
import {contractAddress, contractABI} from "../config"; 
import { ToastContainer, toast } from "react-toastify";

const GrantAccess = () => {
  const [recipientAddress, setRecipientAddress] = useState("");

  const handleGrantAccess = async () => {
    if (!window.ethereum) {
      toast.warning("Please install MetaMask to grant access.");
      return;
    }
  
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
  
      const tx = await contract.grantAccess(recipientAddress);
      await tx.wait();
  
      toast.success("Access successfully granted to "+recipientAddress);
    } catch (error) {
      console.error("Grant Access Error:", error);
      toast.error("Failed to grant access. Make sure the address is valid and you're connected.");
    }
  };

  return (
    <div className="Dashboard">
      <aside className="sidebar">
        <ul>
          <li onClick={() => window.location.href='/individual-dashboard'}>Profile</li>
          <li onClick={() => window.location.href='/preferences'}>Update Preferences</li>
          <li onClick={() => window.location.href='/grant-access'} className="active">Grant Access</li>
          <li onClick={() => window.location.href='/revoke-access'}>Revoke Access</li>
          <li onClick={() => window.location.href = '/pending-requests'}>Pending Requests</li>
          <li onClick={() => window.location.href='/users-with-access'}>Users with Access</li>

        </ul>
        <button className="logout" onClick={() => console.log("Logout clicked")}>Logout</button>
      </aside>

      <div className="dashboard-main">
        <nav className="navbar">
          <h2 className="nav-title">Grant Access</h2>
        </nav>

        <main className="content">
          <p>Enter the wallet address of the user you want to grant access to:</p>
          <input
            className="input-address"
            type="text"
            placeholder="0x..."
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
          />
          <button className="update-btn" onClick={handleGrantAccess}>Grant Access</button>
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

export default GrantAccess;
