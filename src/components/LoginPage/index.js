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

  const navigate = useNavigate();

  // ✅ Redirect to dashboard if already logged in
  useEffect(() => {
    const token = Cookies.get('jwt_token');
    if (token !== undefined) {
      navigate('/');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSuccessful = async (data) => {
    Cookies.set('jwt_token', data.jwtToken, { expires: 30 });

    // ✅ Use credentials.username, not undefined formData
    const userRes = await fetch(
      `http://localhost:3000/users?username=${credentials.username}`
    );
    const userData = await userRes.json();
    const user = Array.isArray(userData) ? userData[0] : userData; // adjust if backend returns array

    if (user?.role === 'patient') {
      navigate(`/patient-dashboard/${user.id}`);
    } else if (user?.role === 'caretaker') {
      navigate(`/caretaker-dashboard/${user.id}`);
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
    console.log('Login credentials:', credentials);

    const apiUrl = 'http://localhost:3000/login';

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

