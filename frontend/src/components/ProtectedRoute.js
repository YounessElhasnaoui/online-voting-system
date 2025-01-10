// src/components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

// ProtectedRoute checks if the user has a token (authentication)
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // If token exists, render the children (protected component), else redirect to login
  return token ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
