// import React from 'react';
import { useState, useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Navbar.module.css";
import { navData } from "../../navData";
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { NavLink } from "react-router-dom";
import logo from './canopy-logo.png';


const Navbar = () => {
  const location = useLocation();
  const [open, setopen] = useState(true);
  const [usr, setUsr] = useState("");

  useEffect(() => {
    setUsr(sessionStorage.getItem("username"));
  }, [usr]);

  if (location.pathname === "/login" || location.pathname === "/register")
    return null;

  const toggleOpen = () => {
    setopen(!open)
  }

  const logout = () => {
    sessionStorage.removeItem("serverToken"); // remove token locally to logout
  };

  return (
    <div className={open ? styles.sidenav : styles.sidenavClosed}>
      {/* <button className={styles.menuBtn} onClick={toggleOpen}>
        {open ? <KeyboardDoubleArrowLeftIcon /> : <KeyboardDoubleArrowRightIcon />}
      </button>
      */}
      <img src={logo}/>
      {navData.map(item => {
        return <NavLink key={item.id} className={styles.sideitem} to={item.link}>
          {item.icon}
          <span className={open ? styles.linkText : styles.linkTextClosed}>{item.text}</span>
        </NavLink>
      })}
      <NavLink className={styles.sideitem} onClick={logout} to="/login">
        <LogoutIcon />
        <span className={open ? styles.linkText : styles.linkTextClosed}>Sign out</span>
      </NavLink>
      {/*
      <div className={styles.userbox}>
        <AccountCircleIcon />
        <span className={open ? styles.linkText : styles.linkTextClosed}>test</span>
        <NavLink className={styles.sideitem} onClick={logout} to="/login">
          <LogoutIcon />
        </NavLink>
        
      </div>
    */}
    </div>
  );
};

export default Navbar;
