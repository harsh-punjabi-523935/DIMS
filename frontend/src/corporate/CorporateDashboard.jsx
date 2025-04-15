import React, { useEffect, useState } from "react";
import "../corporate/styles/corporate_dashboard.css";
import { contractAddress, contractABI } from "../config";
import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CorporateDashboard = () => {

  const navigate = useNavigate()
  const [orgData, setOrgData] = useState({});
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSent: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });
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

      const data = await contract.getCorporateProfile(userAddress); // You must have this function in your contract

    const stats = await contract.getCorporateDashboardStats(userAddress);

    setStats({
      totalSent: Number(stats[0]),
      pending: Number(stats[1]),
      approved: Number(stats[2]),
      rejected: Number(stats[3])
    });

    setOrgData({
      orgName: data[0],
      email: data[1],
      registrationNumber: data[2],
      businessType: data[3],
      headquarters: data[4],
      contactPerson: data[5]
    });


      console.log("Total Sent:", stats[0].toString());
      console.log("Pending:", stats[1].toString());
      console.log("Approved:", stats[2].toString());
      console.log("Rejected:", stats[3].toString());

        


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
          <li onClick={() => navigate('/search-identity')}>Search Identity</li>
          <li onClick={() => navigate('/request-access')}>Request Access</li>
          <li onClick={() => navigate('/corporate-pending-requests')}>Pending Requests</li>
          <li onClick={() => navigate('/approved-access')}>Approved Access</li>
          <li onClick={() => navigate('/corporate-profile')}>Organization Profile</li>

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
    <p>{stats.totalSent}</p>
  </div>
  <div className="card">
    <h3>Access Approved</h3>
    <p>{stats.approved}</p>
  </div>
  <div className="card">
    <h3>Pending Requests</h3>
    <p>{stats.pending}</p>
  </div>
  <div className="card">
    <h3>Requests Rejected</h3>
    <p>{stats.rejected}</p>
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

