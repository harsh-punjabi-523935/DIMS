import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import "../corporate/styles/corporate_login.css";

const IndividualLogin = () => {
  const [account, setAccount] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const connectWallet = async () => {
    setError("");
    setLoading(true);

    try {
      if (!window.ethereum) {
        setError("MetaMask is not installed.");
        setLoading(false);
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setAccount(address);
      await checkRegistration(provider, address);
    } catch (err) {
      console.error("Wallet connection error:", err);
      setError("Connection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const checkRegistration = async (provider, userAddress) => {
    try {
      const contract = new ethers.Contract(contractAddress, contractABI, provider);
      const isRegistered = await contract.isUserRegistered(userAddress);

      if (isRegistered) {
        navigate("/individual-dashboard");
      } else {
        navigate("/individual-registration");
      }
    } catch (err) {
      console.error("Registration check failed:", err);
      setError("Failed to verify registration.");
    }
  };

  return (
    <div className="individual-login-container">
      <h1>Individual Login</h1>
      <p>Secure login via MetaMask</p>

      <button className="connect-button" onClick={connectWallet} disabled={loading}>
        {loading ? "Checking..." : "Connect MetaMask"}
      </button>

      {loading && <div className="spinner"></div>}

      {account && !loading && (
        <p className="wallet-address">Connected: {account}</p>
      )}
      {error && <p className="wallet-address" style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default IndividualLogin;
