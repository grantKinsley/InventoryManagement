import { useState, useContext, useEffect } from "react";
import axios from "axios";
import AuthContext from "../../context-Api/AuthProvider";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./settings.css"

import SettingsNavbar from "./settingsNavbar";
import General from "./General/generalSettings.js"

const Settings = () => {

    if (sessionStorage.getItem("serverToken") === null) {
        return <Navigate to="/login" />;
    }

    return (
        <div>
            <SettingsNavbar />
            <div className="sub-container">
                <Routes>
                    <Route exact path="/"
                        element={<General />} />
                </Routes>
            </div>
        </div>
    )
}

export default Settings;