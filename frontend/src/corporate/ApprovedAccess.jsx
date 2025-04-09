import React, { useEffect, useState } from "react";
import "../corporate/styles/aproved_access.css";
import { ethers } from "ethers";
import { corporateABI, contractAddress } from "../config";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ApprovedAccess = () => {
  const [accessList, setAccessList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // fetchApprovedAccess();
  }, []);

  const fetchApprovedAccess = async () => {
    try {
      if (!window.ethereum) return toast.error("MetaMask not found");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, corporateABI, signer);

      const users = await contract.getMyApprovedAccesses();
      setAccessList(users);
    } catch (error) {
      console.error("Error fetching access list:", error);
      toast.error("Failed to fetch approved access.");
    }
  };

  return (
    <div className="Dashboard">
      <aside className="sidebar">
        <ul>
        <li onClick={() => navigate('/corporate-dashboard')}>Dashboard</li>
          <li onClick={() => navigate('/search-identity')}>Search Identity</li>
          <li onClick={() => navigate('/request-access')}>Request Access</li>
          <li onClick={() => navigate('/corporate-pending-requests')}>Pending Requests</li>
          <li className="active">Approved Access</li>
          <li onClick={() => navigate('/corporate-profile')}>Organization Profile</li>

        </ul>
        <button className="logout" onClick={() => console.log("Logout clicked")}>Logout</button>
      </aside>

      <div className="dashboard-main">
        <nav className="navbar">
          <h2 className="nav-title">Approved Access</h2>
        </nav>

        <main className="content">
          {accessList.length === 0 ? (
            <p>No users have granted access yet.</p>
          ) : (
            <ul className="access-list">
              {accessList.map((user, index) => (
                <li key={index} className="access-card">
                  <p><strong>Name:</strong> {user.requesterName}</p>
                  <p><strong>Wallet:</strong> {user.requesterAddress}</p>
                </li>
              ))}
            </ul>
          )}
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

export default ApprovedAccess;
