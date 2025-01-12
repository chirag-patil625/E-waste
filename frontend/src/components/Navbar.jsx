import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = ({ isAuthenticated }) => {
  const [isOpen, setIsOpen] = useState(false);

  const activeClassName = "text-green-500 font-bold border-b-2 border-green-500 pb-1";
  const inactiveClassName = "text-gray-700 hover:text-green-500 hover:border-b-2 hover:border-green-500 transition-all duration-200 pb-1";

  return (
    <nav className="bg-white shadow-lg relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Brand */}
          <div className="flex-shrink-0">
            <NavLink to="/" className="flex items-center">
              <span className="text-3xl font-bold text-green-600 hover:text-green-700 transition-colors duration-200">E-Waste</span>
            </NavLink>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex flex-grow items-center">
            <div className="flex items-center justify-center space-x-8 flex-grow">
              <NavLink to="/" end className={({ isActive }) => 
                isActive ? activeClassName : inactiveClassName
              }>Home</NavLink>
              
              <NavLink to="/find-facility" className={({ isActive }) => 
                isActive ? activeClassName : inactiveClassName
              }>Find Facility</NavLink>
              
              <NavLink to="/events" className={({ isActive }) => 
                isActive ? activeClassName : inactiveClassName
              }>Events</NavLink>
              
              <NavLink to="/learn" className={({ isActive }) => 
                isActive ? activeClassName : inactiveClassName
              }>Education</NavLink>
              
              <NavLink to="/about-us" className={({ isActive }) => 
                isActive ? activeClassName : inactiveClassName
              }>About Us</NavLink>
            </div>

            {isAuthenticated ? (
              <div className="flex items-center space-x-6 ml-8">
                <NavLink to="/rewards" className={({ isActive }) => 
                  isActive ? activeClassName : inactiveClassName
                }>Rewards</NavLink>
                <NavLink to="/dashboard" className={({ isActive }) => 
                  isActive ? activeClassName : inactiveClassName
                }>Dashboard</NavLink>
              </div>
            ) : (
              <div className="flex items-center space-x-4 ml-8">
                <NavLink 
                  to="/login" 
                  className="bg-transparent text-green-600 px-6 py-2 border-2 border-green-500 rounded-md hover:bg-green-500 hover:text-white transition-all duration-200"
                >
                  Login
                </NavLink>
                <NavLink 
                  to="/signup" 
                  className="bg-green-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-green-600 hover:shadow-lg transform transition-all duration-200 hover:-translate-y-0.5"
                >
                  Sign Up
                </NavLink>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-full text-gray-700 hover:text-green-500 hover:bg-gray-100 focus:outline-none transition-colors duration-200"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 pt-2 pb-3 space-y-2">
            <NavLink to="/" end className={({ isActive }) => 
              `block px-4 py-3 rounded-lg text-base font-medium text-center ${isActive ? 'bg-green-500 text-white' : 'text-gray-700 hover:bg-green-50'}`
            }>Home</NavLink>
            
            <NavLink to="/find-facility" className={({ isActive }) => 
              `block px-4 py-3 rounded-lg text-base font-medium text-center ${isActive ? 'bg-green-500 text-white' : 'text-gray-700 hover:bg-green-50'}`
            }>Find Facility</NavLink>
            
            <NavLink to="/events" className={({ isActive }) => 
              `block px-4 py-3 rounded-lg text-base font-medium text-center ${isActive ? 'bg-green-500 text-white' : 'text-gray-700 hover:bg-green-50'}`
            }>Events</NavLink>
            
            <NavLink to="/learn" className={({ isActive }) => 
              `block px-4 py-3 rounded-lg text-base font-medium text-center ${isActive ? 'bg-green-500 text-white' : 'text-gray-700 hover:bg-green-50'}`
            }>Education</NavLink>
            
            <NavLink to="/about-us" className={({ isActive }) => 
              `block px-4 py-3 rounded-lg text-base font-medium text-center ${isActive ? 'bg-green-500 text-white' : 'text-gray-700 hover:bg-green-50'}`
            }>About Us</NavLink>

            {isAuthenticated ? (
              <>
                <NavLink to="/rewards" className={({ isActive }) => 
                  `block px-4 py-3 rounded-lg text-base font-medium text-center ${isActive ? 'bg-green-500 text-white' : 'text-gray-700 hover:bg-green-50'}`
                }>Rewards</NavLink>
                <NavLink to="/dashboard" className={({ isActive }) => 
                  `block px-4 py-3 rounded-lg text-base font-medium text-center ${isActive ? 'bg-green-500 text-white' : 'text-gray-700 hover:bg-green-50'}`
                }>Dashboard</NavLink>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <NavLink 
                  to="/login" 
                  className="text-center px-4 py-3 border-2 border-green-500 text-green-600 rounded-md hover:bg-green-500 hover:text-white transition-colors duration-200"
                >
                  Login
                </NavLink>
                <NavLink 
                  to="/signup" 
                  className="text-center px-4 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200"
                >
                  Sign Up
                </NavLink>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
