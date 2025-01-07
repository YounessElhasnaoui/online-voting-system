// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login.js";
import Home from "./components/Home.js";
import Register from './components/Register.js';
import Dashboard from './components/Dashboard.js';
import ProtectedRoute from "./components/ProtectedRoute.js";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>}/>
      </Routes>
    </Router>
  );
};

export default App;
