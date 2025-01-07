// src/components/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance.js";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    new Promise((resolve, reject) => {
      axiosInstance
        .post("/login", { email, password })
        .then((response) => {
          // If login is successful, store the token in localStorage
          localStorage.setItem("token", response.data.data.token);
          resolve(response); // Resolving the promise
        })
        .catch((err) => {
          // If login fails, reject the promise
          reject(err);
        });
    })
      .then((response) => {
        setSuccess("Login successful! Redirecting...");
        setError("");
        // Wait a moment for the success message, then navigate to the home page
        setTimeout(() => navigate("/home"), 1500);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Login failed");
        setSuccess("");
      });
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        padding: "40px",
        margin: "10% auto",
        borderRadius: "15px",
        backgroundColor: "#fff",
        boxShadow: "0 12px 30px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Arial', sans-serif",
        textAlign: "center",
      }}
    >
      <h2
        style={{
          marginBottom: "30px",
          color: "#333",
          fontSize: "28px",
          fontWeight: "600",
        }}
      >
        Login
      </h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "20px", textAlign: "left" }}>
          <label
            style={{
              display: "block",
              marginBottom: "10px",
              fontSize: "16px",
              color: "#555",
              fontWeight: "500",
            }}
          >
            Email:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "14px",
              fontSize: "16px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              marginBottom: "15px",
              outline: "none",
              transition: "border 0.3s ease",
              boxSizing: "border-box",
            }}
          />
        </div>
        <div style={{ marginBottom: "30px", textAlign: "left" }}>
          <label
            style={{
              display: "block",
              marginBottom: "10px",
              fontSize: "16px",
              color: "#555",
              fontWeight: "500",
            }}
          >
            Password:
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "14px",
              fontSize: "16px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              marginBottom: "15px",
              outline: "none",
              transition: "border 0.3s ease",
              boxSizing: "border-box",
            }}
          />
        </div>
        {error && (
          <p
            style={{
              color: "#e74c3c",
              fontSize: "14px",
              marginBottom: "10px",
              fontWeight: "600",
            }}
          >
            {error}
          </p>
        )}
        {success && (
          <p
            style={{
              color: "#2ecc71",
              fontSize: "14px",
              marginBottom: "10px",
              fontWeight: "600",
            }}
          >
            {success}
          </p>
        )}
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "15px",
            backgroundColor: "#3498db",
            color: "#fff",
            fontSize: "16px",
            fontWeight: "600",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
            boxSizing: "border-box",
          }}
        >
          Login
        </button>
      </form>
      <div
        style={{
          marginTop: "25px",
          fontSize: "15px",
          color: "#777",
          fontWeight: "400",
        }}
      >
        <span>You're not a member yet?</span>
        <a
          href="#"
          style={{
            color: "#3498db",
            textDecoration: "none",
            fontWeight: "600",
            marginLeft: "5px",
          }}
        >
          Register
        </a>
      </div>
    </div>
  );
};

export default Login;
