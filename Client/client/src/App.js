import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from './components/Header/Navbar';
import Catalog from "./components/Home/Catalog.js"
import Login from "./components/Login/Login.js"
import Register from "./components/Login/Register.js"
import Upload from './components/Upload/Upload';
import Dashboard from './components/Dashboard/Dashboard';

function App() {
  return (
      <BrowserRouter>
      <Navbar />
        <Routes>
          <Route exact path="/"
              element={<Dashboard />} />
          <Route exact path="/login"
              element={<Login />} />
          <Route exact path="/catalog"
            element={<Catalog />} />
          <Route exact path="/register"
            element={<Register />} />
          <Route exact path="/upload"
            element={<Upload />} />

          <Route path="*"
            element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
