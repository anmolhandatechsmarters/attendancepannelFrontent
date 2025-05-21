import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Confirmpassword.css';

const Confirmpassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [notification, setNotification] = useState('');
  const email = location.state?.email; 

  const [logip, setIpAddress] = useState('');
  useEffect(() => {
      const fetchIpAddress = async () => {
          try {
              const response = await axios.get('https://api.ipify.org?format=json');
              setIpAddress(response.data.ip);
          } catch (error) {
              console.error('Error fetching IP address:', error);
          }
      };
      fetchIpAddress();
  }, []);



  const handleSubmit = async (event) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      setNotification('Passwords do not match.');
      return;
    }
    
    try {
      const token = localStorage.getItem('forgetpasswordtoken');
      const result = await axios.post(`${import.meta.env.REACT_APP_BASE_URL}/user/updatepassword`, {
        email,
        newPassword,
        token,
      },{
        params:{logip}
      });


      if (result.data.success) {
        setNotification('Password updated successfully.');
        setTimeout(() => {
          localStorage.removeItem('forgetpasswordtoken');
          navigate('/login');
        }, 2000);
      } else {
        setNotification(result.data.message);
      }
    } catch (error) {
      setNotification('An error occurred. Please try again.');
    }
  };

  return (
    <div className="confirmpassword-container">
      <div className="confirmpassword-card">
        <h2>Update Password</h2>
        {notification && <div className="notification">{notification}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">Update Password</button>
        </form>
      </div>
    </div>
  );
};

export default Confirmpassword;
