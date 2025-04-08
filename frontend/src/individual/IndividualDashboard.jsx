// IndividualDashboard.jsx
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "../individual/styles/individual_dashboard.css";
import { contractAddress, contractABI } from "../config"; 
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const IndividualDashboard = () => {
  const [account, setAccount] = useState(null);
  const [userDetails, setUserDetails] = useState({});
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sharingPrefs, setSharingPrefs] = useState({
    shareName: false,
    shareEmail: false,
    shareId: false,
    sharePhone: false,
    shareDob: false,
    shareGender: false,
    shareAddress: false,
    shareProfilePic: false,
    shareIdentityProof: false,
    shareOccupation: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    checkAuthentication();
  }, []);

  async function checkAuthentication() {
    if (!window.ethereum) {
      console.error("MetaMask not detected!");
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    const userAddress = await signer.getAddress();
    setAccount(userAddress);

    try {
      const registered = await contract.isUserRegistered(userAddress);
      setIsRegistered(registered);
      setLoading(false);

      if (registered) {
        const details = await contract.getFullProfile();
        setUserDetails({
          name: details[0],
          email: details[1],
          id: details[2].toString(),
        });
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
      toast.error("Authentication Failed");
    }
  }

  async function updateSharingPreferences() {
    if (!window.ethereum) return toast.warning("MetaMask not detected");
  
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
  
      const tx = await contract.updateSharingPreferences(
        sharingPrefs.shareName,
        sharingPrefs.shareEmail,
        sharingPrefs.shareId,
        sharingPrefs.sharePhone,
        sharingPrefs.shareDob,
        sharingPrefs.shareGender,
        sharingPrefs.shareAddress,
        sharingPrefs.shareProfilePic,
        sharingPrefs.shareIdentityProof,
        sharingPrefs.shareOccupation
      );
  
      await tx.wait();
      toast.success("Sharing preferences updated successfully!");
      
      // Navigate to the dashboard after updating preferences
      navigate("/individual-dashboard");
    } catch (error) {
      console.error("Error updating sharing preferences:", error);
      toast.error("Failed to update preferences.");
    }
  }

  return (
    <div className="Dashboard">
      <aside className="sidebar">
        <ul>
          <li onClick={() => navigate('/profile')}>Profile</li> {/* Profile button */}
          <li className="active" onClick={() => navigate('/individual-dashboard')}>Update Preferences</li>
          <li onClick={() => navigate('/grant-access')}>Grant Access</li>
          <li onClick={() => navigate('/revoke-access')}>Revoke Access</li>
          <li onClick={() => navigate('/pending-requests')}>Pending Requests</li>
          <li onClick={() => navigate('/users-with-access')}>Users with Access</li>
        </ul>
        <button className="logout" onClick={() => console.log("Logout clicked")}>Logout</button>
      </aside>

      <div className="dashboard-main">
        <nav className="navbar">
          <h2 className="nav-title">User Dashboard</h2>
        </nav>

        <main className="content">
          {loading ? (
            <p>Loading...</p>
          ) : isRegistered ? (
            <div>
              <h3>Welcome, {userDetails.name}!</h3>
              <h4>Update Sharing Preferences</h4>
              <div className="preferences">
                {[{ key: "shareName", label: "Share Name" },
                { key: "shareEmail", label: "Share Email" },
                { key: "shareId", label: "Share ID" },
                { key: "sharePhone", label: "Share Phone" },
                { key: "shareDob", label: "Share DOB" },
                { key: "shareGender", label: "Share Gender" },
                { key: "shareAddress", label: "Share Address" },
                { key: "shareProfilePic", label: "Share Profile Picture" },
                { key: "shareIdentityProof", label: "Share Identity Proof" },
                { key: "shareOccupation", label: "Share Occupation" }].map(({ key, label }) => (
                  <div key={key} className="toggle-row">
                    <span>{label}</span>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={sharingPrefs[key]}
                        onChange={() =>
                          setSharingPrefs({ ...sharingPrefs, [key]: !sharingPrefs[key] })
                        }
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                ))}
              </div>

              <button className="update-btn" onClick={updateSharingPreferences}>
                Update Preferences
              </button>
            </div>
          ) : (
            <p>User not registered. Please register.</p>
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

export default IndividualDashboard;
