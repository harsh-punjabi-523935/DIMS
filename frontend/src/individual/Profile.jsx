import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractAddress, contractABI, pinataApiKey, pinataSecretApiKey } from "../config";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import "../individual/styles/profile.css";

const ProfilePage = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    id: "",
    phone: "",
    dob: "",
    gender: "",
    addressLine: "",
    profilePicHash: "",
    identityProofHash: "",
    occupation: ""
  });

  const [isEditing, setIsEditing] = useState(false);
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [newIdentityProof, setNewIdentityProof] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  // Fetch user data from the blockchain
  const fetchUserData = async () => {
    try {
      if (!window.ethereum) return toast.warning("Please install MetaMask");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      // Fetch all user details (no need to pass account)
      const userDetails = await contract.getFullProfile();

      setUserData({
        name: userDetails[0],
        email: userDetails[1],
        id: userDetails[2].toString(),
        phone: userDetails[3],
        dob: userDetails[4],
        gender: userDetails[5],
        addressLine: userDetails[6],
        profilePicHash: userDetails[7],
        identityProofHash: userDetails[8],
        occupation: userDetails[9]
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to fetch user data.");
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  };

  // Handle file input changes for profile picture and identity proof
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "profilePic") {
      setNewProfilePic(files[0]);
    } else if (name === "identityProof") {
      setNewIdentityProof(files[0]);
    }
  };

  // Upload file to Pinata and return the IPFS hash
  const uploadToPinata = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            pinata_api_key: pinataApiKey,
            pinata_secret_api_key: pinataSecretApiKey
          }
        }
      );

      return res.data.IpfsHash;
    } catch (error) {
      console.error("Error uploading to Pinata:", error);
      toast.error("Failed to upload file.");
    }
  };

  // Save updated profile data
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (!window.ethereum) return toast.warning("Please install MetaMask");

      let profilePicHash = userData.profilePicHash;
      let identityProofHash = userData.identityProofHash;

      // If a new profile picture is selected, upload to Pinata and get the hash
      if (newProfilePic) {
        profilePicHash = await uploadToPinata(newProfilePic);
      }

      // If a new identity proof is selected, upload to Pinata and get the hash
      if (newIdentityProof) {
        identityProofHash = await uploadToPinata(newIdentityProof);
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const tx = await contract.updateUserDetails(
        userData.name,
        userData.email,
        userData.phone,
        userData.dob,
        userData.gender,
        userData.addressLine,
        profilePicHash,
        identityProofHash,
        userData.occupation
      );
      await tx.wait();
      toast.success("Profile updated successfully!");
      setIsEditing(false);
      fetchUserData();
    } catch (error) {
      console.error("Error updating user data:", error);
      toast.error("Failed to update profile.");
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Profile</h2>

        <form>
          <div className="profile-row">
            <input
              name="name"
              placeholder="Full Name"
              value={userData.name}
              onChange={handleChange}
              disabled={!isEditing}
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={userData.email}
              onChange={handleChange}
              disabled={!isEditing}
              required
            />
          </div>

          <div className="profile-row">
            <input
              name="id"
              placeholder="Government ID"
              value={userData.id}
              onChange={handleChange}
              disabled={!isEditing}
              required
            />
            <input
              name="phone"
              placeholder="Phone Number"
              value={userData.phone}
              onChange={handleChange}
              disabled={!isEditing}
              required
            />
          </div>

          <div className="profile-row">
            <input
              name="dob"
              type="date"
              placeholder="Date of Birth"
              value={userData.dob}
              onChange={handleChange}
              disabled={!isEditing}
              required
            />
            <select
              name="gender"
              value={userData.gender}
              onChange={handleChange}
              disabled={!isEditing}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <input
            name="addressLine"
            placeholder="Address"
            value={userData.addressLine}
            onChange={handleChange}
            disabled={!isEditing}
            required
          />
          <input
            name="occupation"
            placeholder="Occupation"
            value={userData.occupation}
            onChange={handleChange}
            disabled={!isEditing}
            required
          />

          {/* File inputs for profile picture and identity proof */}
          {isEditing && (
            <div className="file-upload">
              <input
                type="file"
                name="profilePic"
                onChange={handleFileChange}
                accept="image/*"
              />
              <input
                type="file"
                name="identityProof"
                onChange={handleFileChange}
                accept="image/*"
              />
            </div>
          )}

          {/* Displaying profile and identity proof images */}
          <div className="image-display">
            <p>Profile Picture:</p>
            {userData.profilePicHash && (
              <img
                src={`https://gateway.pinata.cloud/ipfs/${userData.profilePicHash}`}
                alt="Profile"
                className="profile-image"
              />
            )}
            <p>Identity Proof:</p>
            {userData.identityProofHash && (
              <img
                src={`https://gateway.pinata.cloud/ipfs/${userData.identityProofHash}`}
                alt="Identity Proof"
                className="identity-proof-image"
              />
            )}
          </div>

          {/* Toggle Edit / Save */}
          {isEditing ? (
            <button type="button" onClick={handleSave} className="save-btn">
              Save Changes
            </button>
          ) : (
            <button type="button" onClick={() => setIsEditing(true)} className="edit-btn">
              Edit Profile
            </button>
          )}
        </form>

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
    </div>
  );
};

export default ProfilePage;
