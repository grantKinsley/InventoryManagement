// import React from 'react';
import axios from "axios";
import fileDownload from "js-file-download";
import { useState, useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./reportingNavbar.module.css";
import { reportingNavData } from "./reportingNavData";
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { NavLink } from "react-router-dom"

const baseURL = "http://localhost:8000/amz_items/";

const ReportingNavbar = () => {
  const location = useLocation();
  const [open, setopen] = useState(true)
  const downloadCSV = async (e) => {
    const accessToken = sessionStorage.getItem("serverToken");
    const reportURL = baseURL + "reportSales";
    const response = await axios
      .get(reportURL, {
        responseType: "blob",
        headers: {
          Bearer: accessToken,
        }
      })
      .then((res) => {
        fileDownload(res.data, "fileName.CSV");
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  if (location.pathname === "/login" || location.pathname === "/register")
    return null;

  return (
    <div className={styles.sidenav}>
      <label className={styles.sidenav_title}> Reports </label>
      {reportingNavData.map(item => {
        return <NavLink key={item.id} className={styles.sideitem} to={item.link}>
          <span className={styles.linkText}>{item.text}</span>
        </NavLink>
      })}
      <button onClick={downloadCSV}>Download CSV</button>;
    </div>
  );
};

export default ReportingNavbar;
