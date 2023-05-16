import { useState, useContext, useEffect } from "react";
import axios from "axios";
import AuthContext from "../../context-Api/AuthProvider";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./reporting.css"

import ReportingNavbar from "./reportingNavbar";
import SalesReport from "./SalesReport/salesReport.js"

const Reporting = () => {

    if (sessionStorage.getItem("serverToken") === null) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="reporting-container">
            <ReportingNavbar />
            <div className="sub-container">
                <Routes>
                    <Route exact path="/"
                        element={<SalesReport />} />
                    <Route path="*"
                        element={<Navigate to="/*" />} />
                </Routes>
            </div>
        </div>
    )
}

export default Reporting;