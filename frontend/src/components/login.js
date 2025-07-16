import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      navigate('/tasks');
    } catch (err) {
      alert('Login failed: Invalid credentials');
    }
  };

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/register', { username, password });
      alert('Registration successful! Please log in.');
    } catch (err) {
      alert('Registration failed: Username taken');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Task Manager</h2>
      <div className="card p-4" style={{ maxWidth: '400px', margin: 'auto' }}>
        <h3 className="mb-3">Login / Register</h3>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="d-flex justify-content-between">
          <button className="btn btn-primary" onClick={handleLogin}>Login</button>
          <button className="btn btn-secondary" onClick={handleRegister}>Register</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
