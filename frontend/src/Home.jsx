// src/HomePage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import './Home.css'; // Import the CSS file

const HomePage = () => {
    const [isLoading, setIsLoading] = useState(false); // State to track loading
    const navigate = useNavigate(); // Initialize navigate

    const handleGetStartedClick = () => {
        setIsLoading(true); // Set loading to true
        setTimeout(() => {
            navigate('/welcome'); // Navigate after a delay
        }, 2000); // Simulate loading for 2 seconds (you can adjust this)
    };

    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Welcome to NexAlpha</h1>
                <p>Your decentralized identity management system</p>
            </header>
            <div className="home-content">
                <p>Manage your digital identity securely and efficiently. Join us today!</p>
                <button className="home-btn" onClick={handleGetStartedClick} disabled={isLoading}>
                    {isLoading ? "Loading..." : "Get Started"}
                </button>
                {isLoading && (
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                    </div>
                )}
            </div>
            <footer className="home-footer">
                <p>&copy; 2025 NexAlpha. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default HomePage;
