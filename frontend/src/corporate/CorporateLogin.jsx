import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/corporate_login.css";
import "./styles/spinner.css"; // Import spinner styles

const CorporateLogin = () => {
  const [account, setAccount] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const connectWallet = async () => {
    try {
      setLoading(true);
      setError("");

      if (!window.ethereum) {
        setError("MetaMask is not installed.");
        setLoading(false);
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        setAccount(accounts[0]);
        navigate("/corporate-dashboard");
      } else {
        navigate("/corporate-register");
      }
    } catch (err) {
      console.error("Wallet connection error:", err);
      setError("Connection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="corporate-login-container">
      <h1>Corporate Login</h1>
      <p>Secure access using MetaMask wallet</p>
      
      {loading && (
        <div className="rocket-loader">
            <span className="rocket">🚀</span>
        <div className="trail"></div>
        </div>
        )}

      {!loading && (
        <button className="connect-button" onClick={connectWallet}>
          Connect MetaMask
        </button>

      )}

      {account && <p className="wallet-address">Connected: {account}</p>}
      {error && <p className="wallet-address" style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default CorporateLogin;
