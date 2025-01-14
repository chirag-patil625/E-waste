import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from "react-icons/fi";
import loginImg from '../assets/login.png';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      login(data.token); // Use login function from AuthContext
      navigate('/'); // Change this to redirect to profile
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50">
      <div className="container mx-auto px-4 h-full">
        <div className="flex justify-center items-center h-full py-12">
          <div className="flex w-full max-w-[1000px] bg-white rounded-3xl shadow-xl overflow-hidden">
            {/* Left Section - Form */}
            <div className="w-full md:w-1/2 p-8 md:p-12">
              <div className="space-y-6">
                <div className="text-center md:text-left">
                  <h2 className="text-3xl font-bold text-gray-800">Welcome Back!</h2>
                  <p className="mt-2 text-gray-600">Continue your eco-friendly journey</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && <div className="text-red-500 text-sm">{error}</div>}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all duration-200"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all duration-200"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-[34px] text-gray-500"
                    >
                      {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"/>
                      <span className="text-sm text-gray-600">Remember me</span>
                    </label>
                    <Link to="/forgot-password" className="text-sm text-teal-600 hover:text-teal-700">
                      Forgot Password?
                    </Link>
                  </div>

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white py-3 rounded-lg hover:from-teal-600 hover:to-emerald-600 transform transition-all duration-200 hover:scale-[1.02] disabled:opacity-50"
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </button>

                  <p className="text-center text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-teal-600 hover:text-teal-700 font-semibold">
                      Sign Up
                    </Link>
                  </p>
                </form>
              </div>
            </div>

            {/* Right Section - Image */}
            <div className="hidden md:block w-1/2 bg-gradient-to-br from-teal-500 to-emerald-500 p-12">
              <div className="h-full flex items-center justify-center">
                <img 
                  src={loginImg} 
                  alt="Login" 
                  className="w-full max-w-[350px] object-contain filter drop-shadow-xl transform hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
