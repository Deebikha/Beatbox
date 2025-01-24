import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { loginEndpoint, setClientToken } from "../../spotify";
import "./login.css";
const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', { email, password });
      const token = response.data.token;

      localStorage.setItem("backend_token", token);

      window.location.href = loginEndpoint;
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  useEffect(() => {
    const hash = window.location.hash;
    const token = new URLSearchParams(hash.substring(1)).get("access_token");

    if (token) {
      localStorage.setItem("token", token);
      setClientToken(token);
      window.location.hash = "";
      navigate("/library");
    }
  }, [navigate]);

  return (
    <div className="login-container flex">
      <img
        src="https://th.bing.com/th/id/OIP.d_uswl820zrfnXGgCN4V1gHaEK?w=272&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7"
        alt="logo-beatbox"
        className="logo"
      />
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="login-btn">LOGIN</button>
      </form>
    </div>
  );
};

export default LoginForm;
