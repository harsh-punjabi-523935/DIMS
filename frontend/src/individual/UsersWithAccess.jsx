import React, { useEffect, useState } from "react";
import "../individual/styles/users_with_access.css";
import { ethers } from "ethers";
import { contractAddress, contractABI } from "../config";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UsersWithAccess = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      if (!window.ethereum) return alert("Please install MetaMask");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const data = await contract.getUsersWhoHaveAccessToMe();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (userAddress) => {
    try {
      if (!window.ethereum) return toast.error("MetaMask not found");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const tx = await contract.revokeAccess(userAddress);
      await tx.wait();

      toast.success("Access revoked successfully!");
      fetchAccessUsers(); // Refresh list
    } catch (error) {
      console.error("Revoke failed:", error);
      toast.error("Failed to revoke access.");
    }
  };

  return (
    <div className="Dashboard">
      <aside className="sidebar">
        <ul>
          <li onClick={() => window.location.href='/individual-dashboard'}>Profile</li>
          <li onClick={() => window.location.href='/preferences'}>Update Preferences</li>
          <li onClick={() => window.location.href='/grant-access'}>Grant Access</li>
          <li onClick={() => window.location.href='/revoke-access'}>Revoke Access</li>
          <li onClick={() => window.location.href = '/pending-requests'}>Pending Requests</li>
          <li className="active" onClick={() => window.location.href='/users-with-access'}>Users with Access</li>
        </ul>
        <button className="logout" onClick={() => console.log("Logout clicked")}>Logout</button>
      </aside>

      <div className="dashboard-main">
        <nav className="navbar">
          <h2 className="nav-title">Users Who Can View My Data</h2>
        </nav>

        <main className="content">
          {loading ? (
            <p>Loading...</p>
          ) : users.length === 0 ? (
            <p>No one currently has access to your data.</p>
          ) : (
            <ul className="user-list">
              {users.map((user, index) => (
                <li key={index} className="user-item">
                  <p><strong>Address:</strong> {user.requesterAddress}</p>
                  <p><strong>Name:</strong> {user.requesterName}</p>
                  <button
                    className="revoke-btn"
                    onClick={() => handleRevoke(user.requesterAddress)}
                  >
                    Revoke Access
                  </button>
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

export default UsersWithAccess;
