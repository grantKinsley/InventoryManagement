import { useState, useContext, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import styled from 'styled-components';
import React from "react";
import axios from "axios";
import AuthContext from "../../context-Api/AuthProvider";
import loading from "../../resources/loading.gif";
import Data from "../Data/data";
import History from "../History/History.js";
import Button from '@mui/material/Button';
import { Tabs, Tab } from '@mui/material';
import "./analysis.css";

// import Tab from "@mui/material/Tab"
// import Tabs from "@mui/material/Tabs"

export default function Analysis() {

  const [value, setValue] = useState("table");

  const handleChange = (e, val) => {
    setValue(val);
    console.log(val);
  }

  return (
    <div>
      <div className="sub-tab-header">
        <Tabs
          value={value}
          onChange={handleChange}
          >
            <Tab value="table" label="Table" component={Link} to="/analysis"  />
            <Tab value="chart" label="Chart" component={Link} to="/analysis/chart"  />
        </Tabs>
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
