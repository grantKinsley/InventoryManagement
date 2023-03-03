// import React from 'react';
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();

  if (location.pathname === "/login" || location.pathname === "/register")
    return null;

  const logout = () => {
    sessionStorage.removeItem("serverToken"); // store token locally
  };
  return (
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/catalog">Catalog</Link>
      </li>
      <li>
        <Link to="/upload">Upload</Link>
      </li>
      <li>
        <Link to="/">Settings</Link>
      </li>
      <li>
        <Link to="/login" onClick={logout}>
          Logout
        </Link>
      </li>
    </ul>
  );
};

export default Navbar;
