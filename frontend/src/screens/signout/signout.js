// src/screens/signout/SignOut.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './signout.css';

const SignOut = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    const confirmSignOut = window.confirm("Are you sure you want to remove the token?");
    
    if (confirmSignOut) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
    }
    
    navigate('/'); 
  };

  return (
    <div className="screen-container flex">
      <div>
        <h1>Sign Out</h1>
        <p>Are you sure you want to sign out?</p>
        <button onClick={handleSignOut}>Yes</button>
        <button onClick={() => navigate('/')}>No</button>
      </div>
    </div>
  );
};

export default SignOut;
