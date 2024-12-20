import React, { useState } from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom'

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
   const navigate=useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
      user_type: userType,
    };

    try {
      const response = await axios.post('http://localhost:3005/users', userData);

      if (response.status === 200) {
        alert('User created successfully!');
        navigate('/home')
        setErrorMessage('');
      } else {
        setSuccessMessage('');
        setErrorMessage('Failed to create user. Please try again.');
      }
    } catch (error) {
      setSuccessMessage('');
      setErrorMessage(error.response ? error.response.data.message : 'Something went wrong');
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
     
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
     
        <div>
          <label>User Type:</label>
          <input
            type="text"
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            required
          />
        </div>
        <div>
          <button type="submit">SignUp</button>
        </div>
      </form>

      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
      {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
    </div>
  );
};

export default Signup;
