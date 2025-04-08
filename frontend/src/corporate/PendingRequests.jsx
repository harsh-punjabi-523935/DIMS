import React, { useEffect, useState } from "react";
import "./pending_requests.css";
import { ethers } from "ethers";
import { contractAddress, contractABI } from "../corporate/styles/pending_requests.css";
import { toast, ToastContainer } from "react-toastify";

const PendingRequests = () => {
  const [requests, setRequests] = useState([]);
  const [names, setNames] = useState([]);

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const [reqList, nameList] = await contract.AccessRequest();
      setRequests(reqList);
      setNames(nameList);
    } catch (err) {
      console.error("Error fetching requests:", err);
      toast.error("❌ Failed to load pending requests.");
    }
  };

  const respondToRequest = async (requester, action) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const tx = await (action === "accept"
        ? contract.acceptRequest(requester)
        : contract.rejectRequest(requester));
      await tx.wait();
      toast.success(`✅ Request ${action}ed successfully!`);
      fetchPendingRequests();
    } catch (err) {
      console.error(err);
      toast.error(`❌ Failed to ${action} request.`);
    }
  };

  return (
    <div className="Dashboard">
      <aside className="sidebar">
        <ul>
          <li onClick={() => (window.location.href = "/metamask-dashboard")}>Profile</li>
          <li onClick={() => (window.location.href = "/preferences")}>Update Preferences</li>
          <li onClick={() => (window.location.href = "/grant-access")}>Grant Access</li>
          <li onClick={() => (window.location.href = "/revoke-access")}>Revoke Access</li>
          <li className="active">Pending Requests</li>
        </ul>
        <button className="logout" onClick={() => console.log("Logout clicked")}>
          Logout
        </button>
      </aside>

      <div className="dashboard-main">
        <nav className="navbar">
          <h2 className="nav-title">Pending Access Requests</h2>
        </nav>

        <main className="content">
          {requests.length === 0 ? (
            <p>No pending requests.</p>
          ) : (
            <ul className="request-list">
              {requests.map((req, index) =>
                req.isPending ? (
                  <li key={req.requester}>
                    <span>{names[index]}</span>
                    <span className="wallet">{req.requester}</span>
                    <div className="actions">
                      <button onClick={() => respondToRequest(req.requester, "accept")}>Accept</button>
                      <button className="reject" onClick={() => respondToRequest(req.requester, "reject")}>
                        Reject
                      </button>
                    </div>
                  </li>
                ) : null
              )}
            </ul>
          )}
        </main>
        <ToastContainer />
      </div>
    </div>
  );
};

export default PendingRequests;