import React, { useState } from 'react';
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

  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSuccessful = async (data) => {
    Cookies.set('jwt_token', data.jwtToken, { expires: 30 });

    const userRes = await fetch(
      `https://med-track-backend.onrender.com/users?username=${credentials.username}`
    );
    const userData = await userRes.json();
    const user = Array.isArray(userData) ? userData[0] : userData;

    if (user?.role === 'patient') {
      navigate(`/patient-dashboard/${user.id}`);
    } else if (user?.role === 'caretaker') {
      navigate("/caretaker-dashboard");
    } else {
      navigate('/');
    }
  };

  const handleFailure = (errorMsg) => {
    setCredentials({ ...credentials, isError: true, errorMsg });
    console.log(errorMsg);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const apiUrl = 'https://med-track-backend.onrender.com/login';

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    };

    try {
      const response = await fetch(apiUrl, options);
      const data = await response.json();

      if (response.ok) {
        handleSuccessful(data);
      } else {
        handleFailure(data.error_msg);
      }
    } catch (error) {
      handleFailure('Network error');
    }
  };

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
        <button type="submit">Login</button>
        {credentials.isError && <p className="error-msg">{credentials.errorMsg}</p>}
      </form>
    </div>
  );
};

export default LoginPage;
