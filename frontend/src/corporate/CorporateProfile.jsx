import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../config";
import "../corporate/styles/corporate_profile.css";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CorporateProfile = () => {
  const navigate = useNavigate();
  const [orgData, setOrgData] = useState({});

  useEffect(() => {
    fetchOrganizationProfile();
  }, []);

  const fetchOrganizationProfile = async () => {
    try {
      if (!window.ethereum) return toast.error("MetaMask not detected");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      const contract = new ethers.Contract(contractAddress, contractABI, provider);


      const data = await contract.getCorporateProfile(userAddress);
    //   if (!data.exists) return toast.error("Organization not registered");
    setOrgData({
        orgName: data[0],
        email: data[1],
        registrationNumber: data[2],
        businessType: data[3],
        headquarters: data[4],
        contactPerson: data[5]
      });
    //   setProfile(org);
    } catch (error) {
      console.error("Error fetching organization profile:", error);
      toast.error("Failed to load profile");
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
          <li onClick={() => navigate('/approved-access')}>Approved Access</li>
          <li className="active">Organization Profile</li>
        </ul>
        <button className="logout" onClick={() => console.log("Logout clicked")}>Logout</button>
      </aside>

      <div className="dashboard-main">
        <nav className="navbar">
          <h2 className="nav-title">Organization Profile</h2>
        </nav>

        <main className="content">
          {!orgData ? (
            <p>Loading profile...</p>
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

export default CorporateProfile;
