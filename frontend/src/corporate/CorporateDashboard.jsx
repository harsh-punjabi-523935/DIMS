import React, { useEffect, useState } from "react";
import "../corporate/styles/corporate_dashboard.css";
import { contractAddress, contractABI } from "../config";
import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";

const CorporateDashboard = () => {


  const [orgData, setOrgData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCorporateDetails();
  }, []);

  const fetchCorporateDetails = async () => {
    try {
      if (!window.ethereum) return alert("Please install MetaMask");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const userAddress = await signer.getAddress();

      const data = await contract.getCorporateDetails(userAddress);
      setOrgData({
        orgName: data[0],
        email: data[1],
        registrationNumber: data[2],
        businessType: data[3],
        headquarters: data[4],
        contactPerson: data[5]
      });
      setLoading(false);
    } catch (err) {
      console.error("Error fetching corporate data:", err);
      toast.error("Error fetching corporate data")
    }
  };

  return (
    <div className="Dashboard">
      <aside className="sidebar">
        <ul>
          <li className="active">Dashboard</li>
          <li>Search Identity</li>
          <li>Request Access</li>
          <li>Pending Requests</li>
          <li>Approved Access</li>
          <li>Revoke Access</li>
          <li>Organization Profile</li>
        </ul>
        <button className="logout">Logout</button>
      </aside>

      <div className="main-content">
        <header className="navbar">
          <h1>Corporate Dashboard</h1>
        </header>
        
        <section className="overview">
          <h2>Overview</h2>
          <div className="overview-cards">
            <div className="card">
              <h3>Requests Sent</h3>
              <p>12</p>
            </div>
            <div className="card">
              <h3>Access Approved</h3>
              <p>8</p>
            </div>
            <div className="card">
              <h3>Pending Requests</h3>
              <p>4</p>
            </div>
            <div className="card">
              <h3>Requests Rejected</h3>
              <p>4</p>
            </div>
          </div>
        </section>

        <section className="org-info">
          <h2>Organization Info</h2>
          {loading ? (
          <p>Loading organization details...</p>
        ) : (
          <div className="org-details">
            <h2>{orgData.orgName}</h2>
            <p><strong>Email:</strong> {orgData.email}</p>
            <p><strong>Registration No:</strong> {orgData.registrationNumber}</p>
            <p><strong>Business Type:</strong> {orgData.businessType}</p>
            <p><strong>Headquarters:</strong> {orgData.headquarters}</p>
            <p><strong>Contact Person:</strong> {orgData.contactPerson}</p>
          </div>
        )}
        </section>
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

export default CorporateDashboard;

