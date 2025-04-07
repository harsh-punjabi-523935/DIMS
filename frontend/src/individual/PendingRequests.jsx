import React, { useState, useEffect } from "react";
import "../individual/styles/pending_requests.css";
import { ethers } from "ethers";
import { contractAddress, contractABI } from "../config";
import { ToastContainer, toast } from "react-toastify";

const PendingRequests = () => {
  const [requests, setRequests] = useState([]);
  const [names, setNames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    if (!window.ethereum) return alert("Please install MetaMask");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const [reqs, names] = await contract.getRequests();
      setRequests(reqs);
      setNames(names);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch requests:", err);
      toast.error("Unable to fetch data");
    }
  };

  const handleAccept = async (address) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    const tx = await contract.acceptRequest(address);
    await tx.wait();
    toast.success("Access Granted!");
    fetchRequests();
  };

  const handleReject = async (address) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    const tx = await contract.rejectRequest(address);
    await tx.wait();
    toast.success("Access Rejected!");
    fetchRequests();
  };

  return (
    <div className="Dashboard">
      <aside className="sidebar">
        <ul>
          <li onClick={() => window.location.href='/individual-dashboard'}>Profile</li>
          <li onClick={() => window.location.href='/preferences'}>Update Preferences</li>
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
                  req.isPending && (
                    <div className="request-card" key={index}>
                      <p><strong>Name:</strong> {names[index]}</p>
                      <p><strong>Address:</strong> {req.requester}</p>
                      <div className="action-buttons">
                        <button className="accept" onClick={() => handleAccept(req.requester)}>Accept</button>
                        <button className="reject" onClick={() => handleReject(req.requester)}>Reject</button>
                      </div>
                    </div>
                  )
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
