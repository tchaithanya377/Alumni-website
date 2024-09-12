// src/components/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { signInWithEmailAndPassword } from "firebase/auth"; // Import signInWithEmailAndPassword
import { auth } from '../firebase'; // Import Firebase auth

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Authenticate the user using Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Redirect the user after successful login
      setLoading(false);
      navigate('/post'); // Replace with your dashboard or desired page

    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
      <motion.div
        className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-primary text-center mb-6">Login</h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-textColor font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 bg-neutral border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition duration-300"
            />
          </div>

          <div>
            <label className="block text-textColor font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 bg-neutral border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition duration-300"
            />
          </div>

          <div className="text-right">
            <Link to="/forgot-password" className="text-secondary hover:text-indigo-500 transition duration-300">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-accent text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition duration-300"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-textColor">Don't have an account? 
            <Link to="/register" className="text-secondary hover:text-indigo-500 ml-1 transition duration-300">
              Register
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
