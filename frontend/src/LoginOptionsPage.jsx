import React, { useEffect, useState } from "react";
import "./login_options_page.css";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import {contractAddress, contractABI} from "./config"; // Your deployed contract address


const LoginOptionsPage = () => {
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // checkUserRegistration();
  }, []);

  const connecCorporatetWallet = async () => {
    if (!window.ethereum) {
      setError("MetaMask is not installed. Please install it.");
      return;
    }

    try {

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);

      checkCorporateUserRegistration(address);
    } catch (err) {
      console.error("Wallet connection failed:", err);
      setError("Wallet connection failed.");
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError("MetaMask is not installed. Please install it.");
      return;
    }

    try {

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);

      checkUserRegistration(address);
    } catch (err) {
      console.error("Wallet connection failed:", err);
      setError("Wallet connection failed.");
    }
  };

const checkCorporateUserRegistration = async (walletAddress = null) => {
    try {
      
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, contractABI, provider);

      const userAddress = walletAddress || account;
      if (!userAddress) return;
      const isRegistered = await contract.isUserRegistered(userAddress);
      if (isRegistered) {
        navigate("/corporate-dashboard"); // Redirect to dashboard
      } else {
        navigate("/corporate-register")
      }
    } catch (err) {
      console.error("Error checking registration:", err);
    } finally {
      setLoading(false);
    }
  };

  const checkUserRegistration = async (walletAddress = null) => {
    try {
      
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, contractABI, provider);

      const userAddress = walletAddress || account;
      if (!userAddress) return;
      const isRegistered = await contract.isUserRegistered(userAddress);
      if (isRegistered) {
        navigate("/corporate-dashboard"); // Redirect to dashboard
      } else {
        navigate("/corporate-register")
      }
    } catch (err) {
      console.error("Error checking registration:", err);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="landing-container">
      <header className="header">
        <h1 className="brand">NexAlpha</h1>
      </header>

      <main className="main-content">
        <div className="intro-text">
          <h2>Welcome to NexAlpha</h2>
          <p>Choose your login type to access your personalized dashboard</p>

          <div className="button-group">
            <button className="login-btn individual" onClick={(connectWallet)}>Login as Individual</button>
            <button className="login-btn org" onClick={(connecCorporatetWallet)}>Login as Organization</button>
          </div>
        </div>

        <div className="animated-image">
          <img src="/blockchain_animation.gif" alt="Blockchain Animation" />
        </div>
      </main>

      <footer className="footer">
        <p>Created by Mohit Shah, Harsh Punjabi, and Mohammad Arif</p>
        <p>Guided by Debasish Chakraborti</p>
      </footer>
    </div>
  );
};

export default LoginOptionsPage;