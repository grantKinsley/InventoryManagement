import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from './components/Header/Navbar';
import Catalog from "./components/Catalog/Catalog.js"
import Login from "./components/Login/Login.js"
import Register from "./components/Login/Register.js"
import Upload from './components/Upload/Upload';
import Dashboard from './components/Dashboard/Dashboard';
import Analysis from './components/Analysis/analysis';
import History from './components/History/History.js';
import Settings from './components/Settings/settings.js';
import Reporting from './components/Reporting/reporting';
import Invoices from './components/Invoices/invoices';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main>
        <Routes>
          <Route exact path="/"
            element={<Dashboard />} />
          <Route exact path="/login"
            element={<Login />} />
          <Route exact path="/catalog"
            element={<Catalog />} />
          <Route exact path="/register"
            element={<Register />} />
          <Route exact path="/invoices"
            element={<Invoices />} />
          <Route exact path="/upload"
            element={<Upload />} />
          <Route exact path="/reports/*"
            element={<Reporting />} />
          <Route exact path="/analysis/*"
            element={<Analysis />} />
          <Route exact path="/settings/*"
            element={<Settings />} />
          <Route path="*"
            element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
