import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Catalog from "./components/Home/Catalog.js"
import Login from "./components/Login/Login.js"
import Register from "./components/Login/Register.js"

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route exact path="/"
            element={<Catalog />} />
          <Route exact path="/login"
            element={<Login />} />
          <Route exact path="/register"
            element={<Register />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
