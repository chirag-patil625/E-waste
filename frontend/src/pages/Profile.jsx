import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Profile() {
  const location = useLocation();
  // This would come from backend/auth context in future
  const user = {
    name: "John Doe",
    email: "john@example.com",
    joinDate: "January 2024",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    stats: {
      itemsRecycled: 25,
      totalPoints: 1250,
      eventsAttended: 3,
      carbonSaved: "125kg"
    }
  };

  const navigationLinks = [
    { path: '/profile', label: 'Profile Details' },
    { path: '/history', label: 'Recycling History' },
    { path: '/update-profile', label: 'Settings' },
    { path: '/dashboard', label: 'Dashboard' }
  ];

  return (
    <div className="flex-1 min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-teal-500 to-emerald-500 rounded-t-2xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <img 
                src={user.avatar} 
                alt={user.name}
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
              />
              <div className="text-center md:text-left">
                <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                <p className="text-teal-100">Member since {user.joinDate}</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white border-x border-b border-gray-200">
            <div className="text-center p-4 rounded-lg bg-teal-50">
              <div className="text-2xl font-bold text-teal-600">{user.stats.itemsRecycled}</div>
              <div className="text-sm text-gray-600">Items Recycled</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-emerald-50">
              <div className="text-2xl font-bold text-emerald-600">{user.stats.totalPoints}</div>
              <div className="text-sm text-gray-600">Points Earned</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-teal-50">
              <div className="text-2xl font-bold text-teal-600">{user.stats.eventsAttended}</div>
              <div className="text-sm text-gray-600">Events Attended</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-emerald-50">
              <div className="text-2xl font-bold text-emerald-600">{user.stats.carbonSaved}</div>
              <div className="text-sm text-gray-600">Carbon Saved</div>
            </div>
          </div>

          {/* Navigation and Content Area */}
          <div className="bg-white border border-gray-200 rounded-b-2xl">
            {/* Navigation Tabs */}
            <div className="flex border-b border-gray-200 overflow-x-auto">
              {navigationLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
                    location.pathname === link.path
                      ? 'border-b-2 border-teal-500 text-teal-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Profile Details Content */}
            {location.pathname === '/profile' && (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">{user.name}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">{user.email}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
                    <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">{user.joinDate}</div>
                  </div>
                </div>
                <div className="mt-6">
                  <Link 
                    to="/update-profile"
                    className="inline-flex px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                  >
                    Edit Profile
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
