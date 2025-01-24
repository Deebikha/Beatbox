import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './signup.css';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [otpData, setOtpData] = useState({
    otpSent: false,
    otp: '',
    generatedOtp: '',
  });
  const [userId, setUserId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validate = () => {
    let formErrors = {};
    if (!formData.username) formErrors.username = 'Username is required';
    if (!formData.email) {
      formErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      formErrors.email = 'Email is invalid';
    }
    if (!formData.password) formErrors.password = 'Password is required';
    return formErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length === 0) {
      try {
        const response = await axios.post('http://localhost:5000/api/users/register', {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });
        if (response.data.userId) {
          generateOtp();
          setUserId(response.data.userId);
        } else {
          setErrors({ submit: response.data.message || 'Failed to register. Please try again.' });
        }
      } catch (error) {
        console.error('There was an error registering the user:', error);
        if (error.response) {
          // Server responded with a status other than 2xx
          setErrors({ submit: error.response.data.message || 'An error occurred. Please try again.' });
        } else {
          // Network error or other issues
          setErrors({ submit: 'Network error. Please check your connection and try again.' });
        }
      }
    } else {
      setErrors(formErrors);
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (otpData.otp === otpData.generatedOtp) {
      navigate('/login');
    } else {
      setErrors({ submit: 'Invalid OTP. Please try again.' });
    }
  };

  const generateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Generated OTP:', otp); 
    setOtpData({ ...otpData, generatedOtp: otp, otpSent: true });
  };

  return (
    <div className="signup-container flex">
      {!otpData.otpSent ? (
        <div className="signup-content">
          <form onSubmit={handleSubmit} className="signup-form">
            <h1>Signup</h1>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
              {errors.username && <span className="error-message">{errors.username}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>
            <button type="submit">Signup</button>
            {errors.submit && <p className="error-message">{errors.submit}</p>}
          </form>
        </div>
      ) : (
        <div className="otp-content">
          <form onSubmit={handleOtpSubmit} className="otp-form">
            <h1>Verify OTP</h1>
            <div className="form-group">
              <label htmlFor="otp">Enter OTP:</label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={otpData.otp}
                onChange={(e) => setOtpData({ ...otpData, otp: e.target.value })}
                required
              />
            </div>
            <button type="submit">Verify OTP</button>
            {errors.submit && <p className="error-message">{errors.submit}</p>}
          </form>
        </div>
      )}
    </div>
  );
};

export default Signup;
