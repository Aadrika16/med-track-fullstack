import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie"
import './index.css';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    isError:false,
    errorMsg : "",
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSuccessful = async (data)=>{ 

    Cookies.set("jwt_token" , data.jwtToken , {expires:30})  

     // Get user info
      const userRes = await fetch(http://localhost:3000/users?username=${formData.username});
      const user = await userRes.json();

      if (user.role === "patient") {
        navigate(/patient-dashboard/${user.id});
      } else if(user.role==="caretaker") {
        navigate("/caretaker-dashboard/${user.id}");
      }else{
        navigate("/")
  };


}
  const handleFailure = (errorMsg) =>{ 
    setCredentials({...credentials , isError:true , errorMsg}) 
    console.log(errorMsg)
    
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Login credentials:', credentials);
    const apiUrl="http://localhost:3000/login" 
    const options = {
        method : "POST",
        headers : {
            'Content-Type':'application/json',
        },
        body : JSON.stringify(credentials)
    }
    const response = await fetch(apiUrl , options) 
    const data = await response.json() 
    console.log(data.jwtToken) 
    if (response.ok){
       console.log(data.jwtToken) 
       handleSuccessful(data)
    }else{
        console.log(data)
        handleFailure(data.error_msg)
    }
  };
  const token = Cookies.get("jwt_token") 
  if (token===undefined){
    return navigate("/signup")
  }
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
        </form>
      </div>
    );
};

export default LoginPage;
