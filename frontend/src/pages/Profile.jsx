import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import defaultAvatar from '../assets/default-avatar.png'; 

export default function Profile() {
  const { isLoggedIn } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '',
    phone: ''
  });
  
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');

  // Add history state
  const [recentHistory, setRecentHistory] = useState([]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchProfileData();
      fetchRecentHistory();
    }
  }, [isLoggedIn]);

  const fetchProfileData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setProfileData(data.user);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentHistory = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/history', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setRecentHistory(data.slice(0, 3)); // Only get last 3 entries
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Passwords don't match");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/profile/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        },
        body: JSON.stringify({
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();
      if (response.ok) {
        setShowPasswordModal(false);
        setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        setPasswordError('');
      } else {
        setPasswordError(data.message);
      }
    } catch (error) {
      setPasswordError('Failed to change password');
    }
  };

  const handleUpdateProfile = async (data) => {
    try {
      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      if (response.ok) {
        fetchProfileData(); 
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        },
        body: JSON.stringify(editForm)
      });

      const data = await response.json();
      if (response.ok) {
        setProfileData(data.user);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const startEditing = () => {
    setEditForm({
      fullName: profileData?.fullName || '',
      phone: profileData?.phone || ''
    });
    setIsEditing(true);
  };

  const PasswordModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">Change Password</h3>
        <form onSubmit={handleChangePassword} className="space-y-4">
          {passwordError && <div className="text-red-500 text-sm">{passwordError}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-700">Current Password</label>
            <input
              type="password"
              value={passwordData.oldPassword}
              onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
              className="mt-1 w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
              className="mt-1 w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
              className="mt-1 w-full p-2 border rounded"
              required
            />
          </div>
          <div className="flex justify-end space-x-3 mt-4">
            <button
              type="button"
              onClick={() => setShowPasswordModal(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  if (loading) {
    return <div className="min-h-[90vh] flex items-center justify-center">
      <div className="text-lg text-gray-600">Loading...</div>
    </div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex-1 min-h-[calc(100vh-4rem)] bg-gray-50 relative">
      {/* Floating Dashboard Button */}
      <Link 
        to="/dashboard" 
        className="fixed bottom-8 right-8 bg-emerald-500 text-white p-4 rounded-full shadow-lg hover:bg-emerald-600 transition-all duration-300 hover:scale-110 z-50 flex items-center gap-2"
      >
        <svg 
          className="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M4 6h16M4 10h16M4 14h16M4 18h16"
          />
        </svg>
        <span className="font-medium">Dashboard</span>
      </Link>

      {/* Top Navigation Bar
      <div className="bg-white shadow-sm mb-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <h2 className="text-xl font-bold text-gray-800">Profile</h2>
            <Link 
              to="/dashboard"
              className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              <span>Go to Dashboard</span>
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div> */}

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-teal-500 to-emerald-500 p-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <img 
                  src={defaultAvatar}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                />
                <div className="text-center md:text-left">
                  <h1 className="text-2xl font-bold text-white">{profileData?.fullName}</h1>
                  <p className="text-teal-100">{profileData?.email}</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {isEditing ? (
                <form onSubmit={handleEditSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={editForm.fullName}
                      onChange={(e) => setEditForm({...editForm, fullName: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">{profileData?.email}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="text"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                      required
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end space-x-4 mt-4">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Full Name</label>
                      <div className="mt-1 px-4 py-3 bg-gray-50 rounded-lg text-gray-800">{profileData?.fullName}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <div className="mt-1 px-4 py-3 bg-gray-50 rounded-lg text-gray-800">{profileData?.email}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Phone</label>
                      <div className="mt-1 px-4 py-3 bg-gray-50 rounded-lg text-gray-800">{profileData?.phone}</div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
                      <Link 
                        to="/history"
                        className="text-sm text-teal-600 hover:text-teal-700 flex items-center gap-1"
                      >
                        View All
                        <svg 
                          className="w-4 h-4" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    </div>
                    <div className="space-y-3">
                      {recentHistory.length > 0 ? (
                        recentHistory.map((item) => (
                          <div key={item._id} className="bg-white p-3 rounded-lg shadow-sm">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">{item.deviceType}</span>
                              <span className="text-xs text-gray-500">
                                {new Date(item.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-xs text-gray-600">Quantity: {item.quantity}</span>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                item.status === 'completed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {item.status}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          No recycling activity yet
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap gap-4">
                <button
                  onClick={startEditing}
                  className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                >
                  {isEditing ? 'Save Changes' : 'Edit Profile'}
                </button>
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showPasswordModal && <PasswordModal />}
    </div>
  );
}