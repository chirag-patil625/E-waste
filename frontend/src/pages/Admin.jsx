import React, { useState, useEffect } from 'react';
import { FaHome, FaRecycle, FaBook, FaCalendar, FaSignOutAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    pendingRequests: 0,
    totalUsers: 0
  });
  const [recycleRequests, setRecycleRequests] = useState([]);
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  });
  const [events, setEvents] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaHome /> },
    { id: 'requests', label: 'Recycle Requests', icon: <FaRecycle /> },
    { id: 'education', label: 'Education', icon: <FaBook /> },
    { id: 'events', label: 'Events', icon: <FaCalendar /> }
  ];

  // Authentication
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginForm)
      });

      const data = await response.json();

      if (response.ok) {
        sessionStorage.setItem('adminToken', data.token);
        setIsAuthenticated(true);
        setShowLoginModal(false);
        toast.success('Login successful');
        fetchDashboardStats();
        fetchRecycleRequests();
      } else {
        throw new Error(data.error || 'Login failed');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setShowLoginModal(true);
    toast.success('Logged out successfully');
  };

  // Data fetching
  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/admin/dashboard-stats', {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('adminToken')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setDashboardStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchRecycleRequests = async () => {
    try {
      const response = await fetch('http://localhost:5000/admin/recycleRequests', {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('adminToken')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setRecycleRequests(data);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/events', {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('adminToken')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated && activeTab === 'events') {
      fetchEvents();
    }
  }, [isAuthenticated, activeTab]);

  // Request handling
  const handleRequestAction = async (id, status, tokens = 0) => {
    try {
      const response = await fetch(`http://localhost:5000/admin/recycleRequests/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ status, tokens })
      });

      if (response.ok) {
        toast.success(`Request ${status} successfully`);
        fetchRecycleRequests();
        fetchDashboardStats();
      } else {
        throw new Error('Failed to update request');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const response = await fetch(`http://localhost:5000/admin/deleteEvent/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('adminToken')}`
          }
        });

        if (response.ok) {
          toast.success('Event deleted successfully');
          fetchEvents();
        } else {
          throw new Error('Failed to delete event');
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  // Login Modal Component
  const LoginModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-96"> {/* Fixed width instead of max-w-md */}
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Admin Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Username</label>
            <input
              type="text"
              value={loginForm.username}
              onChange={(e) => setLoginForm(prev => ({...prev, username: e.target.value}))}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm(prev => ({...prev, password: e.target.value}))}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );

  // Request Details Modal
  const RequestDetailsModal = ({ request, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Request Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="font-semibold">User Information</h3>
            <p>Name: {request.submittedBy.name}</p>
            <p>Email: {request.submittedBy.email}</p>
            <p>Phone: {request.submittedBy.phone}</p>
          </div>
          <div>
            <h3 className="font-semibold">Device Information</h3>
            <p>Type: {request.deviceType}</p>
            <p>Condition: {request.condition}</p>
            <p>Quantity: {request.quantity}</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold">Address</h3>
          <p>{request.address.street}</p>
          <p>{request.address.city}, {request.address.state} {request.address.zipCode}</p>
          <p>{request.address.country}</p>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold">Description</h3>
          <p>{request.description}</p>
        </div>

        {request.images && request.images.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Images</h3>
            <div className="grid grid-cols-3 gap-4">
              {request.images.map((image, index) => (
                <img
                  key={index}
                  src={`data:${image.contentType};base64,${Buffer.from(image.data).toString('base64')}`}
                  alt={`Device ${index + 1}`}
                  className="w-full h-40 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        )}

        {request.status === 'pending' && (
          <div className="mt-6 flex justify-end space-x-4">
            <input
              type="number"
              placeholder="Tokens"
              className="w-24 px-3 py-2 border rounded"
              onChange={(e) => request.tokens = parseInt(e.target.value)}
            />
            <button
              onClick={() => {
                handleRequestAction(request._id, 'approved', request.tokens);
                onClose();
              }}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Approve
            </button>
            <button
              onClick={() => {
                handleRequestAction(request._id, 'rejected');
                onClose();
              }}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // Show login modal if not authenticated
  if (!isAuthenticated) {
    return showLoginModal && <LoginModal />;
  }

  // Rest of your existing admin dashboard UI
  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
        </div>
        <nav className="mt-4 flex flex-col h-[calc(100vh-5rem)]">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-6 py-3 text-left ${
                activeTab === item.id ? 'bg-blue-600' : 'hover:bg-gray-700'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </button>
          ))}
          <button 
            onClick={handleLogout}
            className="w-full flex items-center px-6 py-3 text-left text-red-400 hover:bg-gray-700 mt-auto"
          >
            <FaSignOutAlt className="mr-3" />
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-gray-100">
        <header className="bg-white shadow-md p-4">
          <h1 className="text-2xl font-semibold text-gray-800">
            {sidebarItems.find(item => item.id === activeTab)?.label}
          </h1>
        </header>

        <main className="p-6">
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4">Pending Requests</h3>
                <p className="text-3xl font-bold text-blue-600">{dashboardStats.pendingRequests}</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4">Total Users</h3>
                <p className="text-3xl font-bold text-green-600">{dashboardStats.totalUsers}</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4">Total Recycled</h3>
                <p className="text-3xl font-bold text-purple-600">1,234 kg</p>
              </div>
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="bg-white rounded-lg shadow-md">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recycleRequests.map((request) => (
                      <tr 
                        key={request._id} 
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowRequestModal(true);
                        }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">{request.submittedBy?.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{request.deviceType}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{request.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            request.status === 'approved' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {request.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap space-x-2">
                          {request.status === 'pending' && (
                            <>
                              <input
                                type="number"
                                placeholder="Tokens"
                                className="w-20 px-2 py-1 border rounded"
                                onChange={(e) => {
                                  const tokens = parseInt(e.target.value);
                                  if (tokens >= 0) {
                                    request.tokens = tokens;
                                  }
                                }}
                              />
                              <button 
                                onClick={() => handleRequestAction(request._id, 'approved', request.tokens)}
                                className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                              >
                                Approve
                              </button>
                              <button 
                                onClick={() => handleRequestAction(request._id, 'rejected')}
                                className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'education' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4">Add New Content</h3>
                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder="Title"
                    className="w-full p-2 border rounded"
                  />
                  <textarea
                    placeholder="Description"
                    className="w-full p-2 border rounded"
                    rows="4"
                  />
                  <select className="w-full p-2 border rounded">
                    <option>Basic</option>
                    <option>Advanced</option>
                    <option>Expert</option>
                  </select>
                  <input
                    type="file"
                    className="w-full p-2 border rounded"
                  />
                  <button className="bg-blue-600 text-white px-4 py-2 rounded">
                    Add Content
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div className="space-y-6">
              {/* Add Event Form */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4">Add New Event</h3>
                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder="Event Name"
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="date"
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    className="w-full p-2 border rounded"
                  />
                  <textarea
                    placeholder="Description"
                    className="w-full p-2 border rounded"
                    rows="4"
                  />
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                    Create Event
                  </button>
                </form>
              </div>

              {/* Events List */}
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Current Events</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {events.map(event => (
                      <div key={event._id} className="border rounded-lg p-4">
                        <img 
                          src={event.image} 
                          alt={event.title}
                          className="w-full h-48 object-cover rounded-lg mb-4" 
                        />
                        <h4 className="font-semibold">{event.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{event.date}</p>
                        <p className="text-sm text-gray-500 mb-4">{event.description.substring(0, 100)}...</p>
                        <button
                          onClick={() => handleDeleteEvent(event._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Delete Event
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Request Details Modal */}
      {showRequestModal && selectedRequest && (
        <RequestDetailsModal 
          request={selectedRequest} 
          onClose={() => {
            setShowRequestModal(false);
            setSelectedRequest(null);
          }}
        />
      )}
    </div>
  );
}
