import React from 'react';
import { Link } from 'react-router-dom';
import loginImg from '../assets/signup.png';

export default function Signup() {
  return (
    <div className="min-h-[90vh] bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50">
      <div className="container mx-auto px-4 h-full">
        <div className="flex justify-center items-center h-full py-12">
          <div className="flex w-full max-w-[1000px] bg-white rounded-3xl shadow-xl overflow-hidden">
            {/* Left Section - Image */}
            <div className="hidden md:block w-1/2 bg-gradient-to-br from-teal-500 to-emerald-500 p-12">
              <div className="h-full flex items-center justify-center">
                <img 
                  src={loginImg} 
                  alt="Sign up" 
                  className="w-full max-w-[350px] object-contain filter drop-shadow-xl transform hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>

            {/* Right Section - Form */}
            <div className="w-full md:w-1/2 p-8 md:p-12">
              <div className="space-y-6">
                <div className="text-center md:text-left">
                  <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
                  <p className="mt-2 text-gray-600">Join our eco-friendly community today</p>
                </div>

                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all duration-200"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all duration-200"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all duration-200"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all duration-200"
                      placeholder="Create a password"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all duration-200"
                      placeholder="Confirm your password"
                    />
                  </div>

                  <div className="flex items-center space-x-2 mt-4">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"/>
                    <span className="text-sm text-gray-600">I agree to the Terms of Service and Privacy Policy</span>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white py-3 rounded-lg hover:from-teal-600 hover:to-emerald-600 transform transition-all duration-200 hover:scale-[1.02] mt-6"
                  >
                    Create Account
                  </button>
                </form>

                <p className="text-center text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="text-teal-600 hover:text-teal-700 font-semibold">
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
