import React from "react";
import HomePage from './Home';
import LoginOptionsPage from "./LoginOptionsPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import "bootstrap/dist/css/bootstrap.min.css";
import IndividualRegistration from "./individual/IndividualRegistration";
import IndividualDashboard from "./individual/IndividualDashboard";
import ProfilePage from "./individual/Profile";
import GrantAccess from "./individual/GrantAccess";
import RevokeAccess from "./individual/RevokeAccess";
import PendingRequests from "./individual/PendingRequests";
import UsersWithAccess from "./individual/UsersWithAccess";
import CorporateRegister from "./corporate/CorporateRegister";
import CorporateDashboard from "./corporate/CorporateDashboard";
import SearchIdentity from "./corporate/SearchIdentity";
import RequestAccess from "./corporate/RequestAccess";
import CorporatePendingRequests from "./corporate/CorporatePendingRequests";
import ApprovedAccess from "./corporate/ApprovedAccess";
import CorporateProfile from "./corporate/CorporateProfile";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Home Page Route */}
        <Route path="/" element={<HomePage />} />

        {/* Individual Routes */}
        <Route path="/welcome" element={<LoginOptionsPage />} />
        <Route path="/individual-registration" element={<IndividualRegistration />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/individual-dashboard" element={<IndividualDashboard />} />
        <Route path="/grant-access" element={<GrantAccess />} />
        <Route path="/revoke-access" element={<RevokeAccess />} />
        <Route path="/pending-requests" element={<PendingRequests />} />
        <Route path="/users-with-access" element={<UsersWithAccess />} />

        {/* Corporate Routes */}
        <Route path="/corporate-register" element={<CorporateRegister />} />
        <Route path="/corporate-dashboard" element={<CorporateDashboard />} />
        <Route path="/search-identity" element={<SearchIdentity />} />
        <Route path="/request-access" element={<RequestAccess />} />
        <Route path="/corporate-pending-requests" element={<CorporatePendingRequests />} />
        <Route path="/approved-access" element={<ApprovedAccess />} />
        <Route path="/corporate-pending-requests" element={<CorporatePendingRequests />} />
        <Route path="/corporate-profile" element={<CorporateProfile />} />
        
      </Routes>
    </Router>
  );
};

export default App;
