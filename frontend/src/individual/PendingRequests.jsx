import React, { useState, useEffect } from "react";
import "../individual/styles/pending_requests.css";
import { ethers } from "ethers";
import { contractAddress, contractABI } from "../config";
import { ToastContainer, toast } from "react-toastify";

const PendingRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);


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

  const fetchRequests = async () => {
    if (!window.ethereum) return alert("Please install MetaMask");
  
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
  
      // Call the contract method with proper address
      const [addresses, names] = await contract.getPendingAccessRequests(await signer.getAddress());
      // console.log("Fetched requests:", reqs); // Log the data to check
      const combined = addresses.map((addr, index) => ({
        requester: addr,
        name: names[index],
      }));
      setRequests(combined);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch requests:", err);
      if (err.data) {
        console.error("Error data:", err.data);
      }
      toast.error("Unable to fetch data: " + (err.message || err));
    }
  };
  

  const handleAccept = async (address) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    try {
      const tx = await contract.acceptRequest(address);
      await tx.wait();
      toast.success("Access Granted!");
      fetchRequests(); // Refresh the requests list

      const userDetails = await contract.getFullProfile();
      const name = userDetails[0];
      const userEmail = "shah1857@saskpolytech.ca"
      const signerAddress = await signer.getAddress();

      const tx1 = await contract.requestAccess(ownerAddress);
      await tx1.wait();

      const subject = `Data Access Request Accepted from ${name}`;

      const message = `
        <h2>Data Access Request Accepted</h2>
        <p><strong>${name}</strong> has accepted your request access to identity data.</p>
        <p>User Wallet Address: <strong>${signerAddress}</strong></p>
        `;
  
      await sendEmail(userEmail, subject, message);

    } catch (err) {
      console.error("Error accepting request:", err);
      toast.error("Error granting access");
    }
  };

  const handleReject = async (address) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    try {
      const tx = await contract.rejectRequest(address);
      await tx.wait();
      toast.success("Access Rejected!");
      fetchRequests(); // Refresh the requests list

      const userDetails = await contract.getFullProfile();
      const name = userDetails[0];
      const userEmail = "shah1857@saskpolytech.ca"
      const signerAddress = await signer.getAddress();

      const tx1 = await contract.requestAccess(ownerAddress);
      await tx1.wait();

      const subject = `Data Access Request Rejected from ${name}`;

      const message = `
        <h2>Data Access Request Rejected</h2>
        <p><strong>${name}</strong> has rejected your request access to identity data.</p>
        <p>User Wallet Address: <strong>${signerAddress}</strong></p>
        `;
  
      await sendEmail(userEmail, subject, message);
    } catch (err) {
      console.error("Error rejecting request:", err);
      toast.error("Error rejecting access");
    }
  };

  return (
    <div className="Dashboard">
      <aside className="sidebar">
        <ul>
          <li onClick={() => window.location.href='/profile'}>Profile</li>
          <li onClick={() => window.location.href='/individual-dashboard'}>Update Preferences</li>
          <li onClick={() => window.location.href='/grant-access'}>Grant Access</li>
          <li onClick={() => window.location.href='/revoke-access'}>Revoke Access</li>
          <li className="active" onClick={() => window.location.href='/pending-requests'}>Pending Requests</li>
          <li onClick={() => window.location.href='/users-with-access'}>Users with Access</li>
        </ul>
        <button className="logout" onClick={() => console.log("Logout clicked")}>Logout</button>
      </aside>

      <div className="dashboard-main">
        <nav className="navbar">
          <h2 className="nav-title">Pending Requests</h2>
        </nav>

        <main className="content">
          {loading ? <p>Loading...</p> : (
            <div className="requests-list">
              {requests.length === 0 ? <p>No pending requests.</p> : (
                requests.map((req, index) => (
                  <div className="request-card" key={index}>
                    <p><strong>Name:</strong> {req.name}</p>
                    <p><strong>Address:</strong> {req.requester}</p>
                    <div className="action-buttons">
                      <button className="accept-btn" onClick={() => handleAccept(req.requester)}>Accept</button>
                      <button className="reject-btn" onClick={() => handleReject(req.requester)}>Reject</button>
                    </div>
                  </div>
                ))
              )}
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

export default PendingRequests;
