import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // Hook for navigation

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Register user function
  const registerUser = (userData) => {
    return new Promise((resolve, reject) => {
      fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success && data.data.token) {
            resolve(data.data); // Resolve the promise with the data
          } else {
            reject(data.message || 'Registration failed');
          }
        })
        .catch((err) => {
          reject('Server error');
        });
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { username, email, password } = formData;

    // Simple validation
    if (!username || !email || !password) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    try {
      const data = await registerUser(formData);

      // Store the token in localStorage
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }

      // Optionally store user details
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      // Redirect to the dashboard
      navigate('/dashboard');
    } catch (err) {
      // Handle errors
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      {/* Quick link section */}
      <p className="quick-link">
        Already have an account? <a href="/login">Login</a>
      </p>

      <style>{`
        /* General Styles */
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f9;
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }

        /* Container for the registration form */
        .register-container {
          background-color: #fff;
          padding: 20px 30px;
          border-radius: 10px;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
          width: 400px;
          text-align: center;
        }

        .register-container h2 {
          margin-bottom: 20px;
          font-size: 24px;
          color: #333;
        }

        /* Form Styles */
        form {
          display: flex;
          flex-direction: column;
        }

        .form-group {
          margin-bottom: 15px;
          text-align: left;
        }

        .form-group label {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 5px;
          display: block;
          color: #555;
        }

        .form-group input {
          width: 100%;
          padding: 10px;
          font-size: 14px;
          border: 1px solid #ccc;
          border-radius: 5px;
          box-sizing: border-box;
        }

        .form-group input:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
        }

        /* Button Styles */
        button {
          padding: 10px 15px;
          font-size: 16px;
          font-weight: bold;
          background-color: #007bff;
          color: #fff;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        button:hover {
          background-color: #0056b3;
        }

        button:disabled {
          background-color: #6c757d;
          cursor: not-allowed;
        }

        /* Error Message */
        .error-message {
          background-color: #f8d7da;
          color: #721c24;
          padding: 10px;
          border: 1px solid #f5c6cb;
          border-radius: 5px;
          margin-bottom: 15px;
        }

        /* Quick Link Styles */
        .quick-link {
          margin-top: 20px;
          font-size: 14px;
          color: #555;
        }

        .quick-link a {
          color: #007bff;
          text-decoration: none;
          font-weight: bold;
        }

        .quick-link a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default Register;
