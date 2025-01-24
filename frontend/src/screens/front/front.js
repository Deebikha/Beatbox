import React from 'react';
import { useNavigate } from 'react-router-dom';
import './front.css';

const Front = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  return (
    <div className="front-page">
      <h1>Welcome to BeatBox</h1>
      <div className="button-container">
        <button className="front-btn" onClick={handleLoginClick}>
          Log In
        </button>
        <button className="front-btn" onClick={handleSignupClick}>
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Front;
