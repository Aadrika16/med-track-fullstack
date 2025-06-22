import React, { useState  } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'patient',
    email:''
  });
   const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Signup Data:', formData);
    const apiUrl = "https://med-track-backend.onrender.com/signup" 
    const options = {
        method:"POST",
         headers: {
       'Content-Type': 'application/json',
      },
      body : JSON.stringify(formData)
    }
    const response = await fetch(apiUrl , options)  
    const data = await response.text() 
    if (response.ok){
        console.log(data)
        setFormData({username:"" , password:"" ,role : "" , email:""})
        navigate("/login")
    }
    
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Create an Account</h2>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="patient">Patient</option>
          <option value="caretaker">Caretaker</option>
        </select>
         <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
