import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './index.css';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    isError: false,
    errorMsg: '',
  });

  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSuccessful = async (data) => {
    Cookies.set('jwt_token', data.jwtToken, { expires: 30 });

    try {
      const userRes = await fetch(
        `https://med-track-backend.onrender.com/users?username=${credentials.username}`
      );
      const userData = await userRes.json();
      const user = Array.isArray(userData) ? userData[0] : userData;

      if (user?.role) {
        setUserRole(user.role);
        setUserId(user.id);
      } else {
        handleFailure('User role not found');
      }
    } catch (err) {
      console.error('Failed to fetch user info', err);
      handleFailure('Error fetching user info');
    }
  };

  const handleFailure = (errorMsg) => {
    setCredentials((prev) => ({
      ...prev,
      isError: true,
      errorMsg,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = 'https://med-track-backend.onrender.com/login';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        handleSuccessful(data);
      } else {
        handleFailure(data.error_msg || 'Login failed');
      }
    } catch (error) {
      handleFailure('Network error');
    }
  };

  // 🚀 Navigate based on user role after fetching it
  useEffect(() => {
    if (userRole && userId) {
      if (userRole === 'patient') {
        navigate(`/patient-dashboard/${userId}`);
      } else {
        navigate('/caretaker-dashboard');
      }
    }
  }, [userRole, userId, navigate]);

  // ✅ Optional: Redirect to home if token exists
  useEffect(() => {
    const token = Cookies.get('jwt_token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={credentials.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange}
          required
        />
        {credentials.isError && (
          <p className="error-text">{credentials.errorMsg}</p>
        )}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
