import React, { useState, useEffect } from 'react';
import './dashboard_page.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [sharingPreferences, setSharingPreferences] = useState({
    shareName: false,
    shareEmail: false,
    shareId: false,
  });

  useEffect(() => {
    // Simulating fetching user data (could be from backend or smart contract)
    setUser({
      name: 'John Doe',
      email: 'john.doe@example.com',
      id: 12345,
      shareName: false,
      shareEmail: false,
      shareId: false,
    });
  }, []);

  const handlePreferencesChange = (e) => {
    const { name, checked } = e.target;
    setSharingPreferences({
      ...sharingPreferences,
      [name]: checked,
    });
  };

  const handleSubmitPreferences = () => {
    // Update sharing preferences on the smart contract (via web3 or other method)
    console.log('Updated Preferences:', sharingPreferences);
    // You can integrate the contract method here for actual preferences update
  };

  return (
    <div className="dashboard-container">
      <header className="header">
        <h1>Identity Dashboard</h1>
        <nav className="nav">
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/profile">Profile</a></li>
            <li><a href="/settings">Settings</a></li>
          </ul>
        </nav>
      </header>

      <div className="main-content">
        {/* Sidebar */}
        <aside className="sidebar">
          <ul>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/profile">Profile</a></li>
            <li><a href="/settings">Settings</a></li>
            <li><a href="/login">Logout</a></li>
          </ul>
        </aside>

        {/* Main Content Area */}
        <main className="content">
          {user && (
            <div className="user-details">
              <h2>Welcome, {user.name}</h2>
              <p>Email: {user.email}</p>
              <p>ID: {user.id}</p>

              <h3>Sharing Preferences</h3>
              <div className="preferences">
                <label>
                  <input
                    type="checkbox"
                    name="shareName"
                    checked={sharingPreferences.shareName}
                    onChange={handlePreferencesChange}
                  />
                  Share Name
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="shareEmail"
                    checked={sharingPreferences.shareEmail}
                    onChange={handlePreferencesChange}
                  />
                  Share Email
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="shareId"
                    checked={sharingPreferences.shareId}
                    onChange={handlePreferencesChange}
                  />
                  Share ID
                </label>
              </div>
              <button onClick={handleSubmitPreferences}>Update Preferences</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
