import React from "react";
import "./LoginOptionsPage.css"; 
import { useNavigate } from "react-router-dom";

const LoginOptionsPage = () => {

  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="welcome-box">
        <h1 className="heading">Welcome</h1>
        <p className="subheading">Please choose your login option:</p>
        <div className="buttons-container">
          <button 
            style={{
              padding: '15px',
              fontSize: '18px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              color: '#ffffff',
              backgroundColor: '#34c759', /* for org-btn */
            }}
            className="org-btn"
            onClick={() => navigate("/business-login")}
          >
            Organization Login
          </button>
          <button
               style={{
                padding: '15px',
                fontSize: '18px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                color: '#ffffff',
                backgroundColor: '#ff9500', /* for org-btn */
              }}
            className="personal-btn"
            onClick={() => navigate("/login")}
          >
            Personal Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginOptionsPage;
