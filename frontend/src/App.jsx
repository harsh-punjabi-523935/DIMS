import React from "react";
import LoginOptionsPage from "./LoginOptionsPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import "bootstrap/dist/css/bootstrap.min.css";
import IndividualRegistration from "./individual/IndividualRegistration";
import IndividualDashboard from "./individual/IndividualDashboard";
import GrantAccess from "./individual/GrantAccess";
import RevokeAccess from "./individual/RevokeAccess";
import PendingRequests from "./individual/PendingRequests";
import UsersWithAccess from "./individual/UsersWithAccess";
import CorporateRegister from "./corporate/CorporateRegister";
import CorporateDashboard from "./corporate/CorporateDashboard";
import SearchIdentity from "./corporate/SearchIdentity";
import RequestAccess from "./corporate/RequestAccess";

const App = () => {
  return(
    <Router>
      <Routes>
      
        <Route path="/welcome" element={<LoginOptionsPage/>}/>
        <Route path="/individual-registration" element={<IndividualRegistration />} />
        <Route path="/individual-dashboard" element={<IndividualDashboard />} />
        <Route path="/grant-access" element={<GrantAccess />} />
        <Route path="/revoke-access" element={<RevokeAccess />} />
        <Route path="/pending-requests" element={<PendingRequests />} />
        <Route path="/users-with-access" element={<UsersWithAccess />} />
        <Route path="/users-with-access" element={<UsersWithAccess />} />

        {/* Corporate Webpages */}
        <Route path="/corporate-register" element={<CorporateRegister />} />
        <Route path="/corporate-dashboard" element={<CorporateDashboard />} />
        <Route path="/search-identity" element={<SearchIdentity />} />
        <Route path="/request-access" element={<RequestAccess />} />
        
      </Routes>
    </Router>
  );
};

export default App;
