import React, { useState } from "react";
import { ethers } from "ethers";
import { contractAddress, contractABI } from "../config";
import "../corporate/styles/search_identity.css";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SearchIdentity = () => {
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setError("");
    setResult(null);
  
    try {
      if (!ethers.isAddress(walletAddress)) {
        toast.error("Invalid wallet address.");
        return;
      }
  
      if (!window.ethereum) {
        toast.error("MetaMask not detected.");
        return;
      }
  
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
  
      const data = await contract.searchIdentity(walletAddress);
      setResult({
        name: data[0],
        email: data[1],
        id: data[2].toString(),
        phone: data[3],
        dob: data[4],
        gender: data[5].toString(),
        addressLine: data[6].toString(),
        occupation: data[9]
      });
    } catch (err) {
      console.error(err);
      toast.error("Could not fetch identity. Make sure the user is registered and accessible.");
    }
  };
  

  return (
    <div className="search-dashboard">
      <aside className="sidebar">
        <ul>
        <li onClick={() => navigate('/corporate-dashboard')}>Dashboard</li>
          <li className="active">Search Identity</li>
          <li onClick={() => navigate('/request-access')}>Request Access</li>
          <li onClick={() => navigate('/corporate-pending-requests')}>Pending Requests</li>
          <li onClick={() => navigate('/approved-access')}>Approved Access</li>
          <li onClick={() => navigate('/corporate-profile')}>Organization Profile</li>
        </ul>
        <button className="logout" onClick={() => console.log("Logout clicked")}>Logout</button>
      </aside>

      <div className="search-container">
        <h2>Search User Identity</h2>
        <input
          type="text"
          placeholder="Enter Wallet Address"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>

        {error && <p className="error">{error}</p>}

        {result && (
          <div className="result-box">
            <h3>Identity Details:</h3>
            <p><strong>Name:</strong> {result.name}</p>
            <p><strong>Email:</strong> {result.email}</p>
            <p><strong>ID:</strong> {result.id}</p>
            <p><strong>Phone:</strong> {result.phone}</p>
            <p><strong>Date of Birth:</strong> {result.dob}</p>
            <p><strong>Gender:</strong> {result.gender}</p>
            <p><strong>Address:</strong> {result.addressLine}</p>
            <p><strong>Occupation:</strong> {result.occupation}</p>

          </div>
        )}
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

export default SearchIdentity;
