import { useState, useContext, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { NavLink } from "react-router-dom"
import styled from 'styled-components'
import React from "react";
import axios from "axios";
import AuthContext from "../../context-Api/AuthProvider";
import loading from "../../resources/loading.gif"
import Data from "../Data/data"
import History from "../History/History.js"
import Button from '@mui/material/Button'
import "./analysis.css"

// import Tab from "@mui/material/Tab"
// import Tabs from "@mui/material/Tabs"

export default function Analysis() {
  return (
    <div>
      <div className="sub-tab-header">
        <NavLink className="sub-nav-button" to="/analysis">
          <Button variant="outlined"> Table </Button>
        </NavLink>
        <NavLink className="sub-nav-button" to="/analysis/chart">
          <Button variant="outlined"> Chart </Button>
        </NavLink>
      </div>
      <div className="sub-container">
        <Routes>
          <Route exact path="/"
            element={<Data />} />
          <Route exact path="/chart"
            element={<History />} />
        </Routes>
      </div>
    </div>
  );
}
