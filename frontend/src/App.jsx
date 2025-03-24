import React from "react";
import LoginOptionsPage from "./LoginOptionsPage";
import "./index.css";
import RegistrationPage from "./RegistrationPage";
import DashboardPage from "./DashboardPage";
import LoginPage from "./LoginPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import BusinessLoginPage from "./business_pages/BusinessLoginPage";
import BusinessRegistrationPage from "./business_pages/BusinessRegistrationPage";

const App = () => {
  return(
    <Router>
      <Routes>
        <Route path="/welcome" element={<LoginOptionsPage/>}/>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/welcome" element={<LoginOptionsPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/business-login" element={<BusinessLoginPage />} />
        <Route path="/business-registration" element={<BusinessRegistrationPage />} />
        

      </Routes>
    </Router>
  );
};

export default App;
