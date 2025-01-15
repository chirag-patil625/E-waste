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

  // Add new state for forms
  const [educationForm, setEducationForm] = useState({
    title: '',
    description: '',
    category: 'Basic',
    articleLink: '',
    imageUrl: ''  // Changed from image to imageUrl
  });

  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    category: '',
    registrationLink: '',
    imageUrl: ''  // Changed from image to imageUrl
  });

  // Add state for education list
  const [educationList, setEducationList] = useState([]);

  // Add categories constant
  const EVENT_CATEGORIES = ['Collection Drive', 'Workshop', 'Conference'];

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

  const fetchEducation = async () => {
    try {
      const response = await fetch('http://localhost:5000/admin/education', {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('adminToken')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setEducationList(data);
      }
    } catch (error) {
      console.error('Error fetching education:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      if (activeTab === 'events') {
        fetchEvents();
      } else if (activeTab === 'education') {
        fetchEducation();
      }
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

  // Add handlers for education and events
  const handleAddEducation = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(educationForm).forEach(key => {
      formData.append(key, educationForm[key]);
    });

    try {
      const response = await fetch('http://localhost:5000/admin/addEducation', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('adminToken')}`
        },
        body: formData
      });

      if (response.ok) {
        toast.success('Education content added successfully');
        setEducationForm({
          title: '',
          description: '',
          category: 'Basic',
          articleLink: '',
          imageUrl: ''  // Changed from image to imageUrl
        });
      } else {
        throw new Error('Failed to add education content');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(eventForm).forEach(key => {
      formData.append(key, eventForm[key]);
    });

    try {
      const response = await fetch('http://localhost:5000/admin/addEvent', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('adminToken')}`
        },
        body: formData
      });

      if (response.ok) {
        toast.success('Event added successfully');
        setEventForm({
          title: '',
          description: '',
          date: '',
          category: '',
          registrationLink: '',
          imageUrl: ''  // Changed from image to imageUrl
        });
        fetchEvents();
      } else {
        throw new Error('Failed to add event');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Add this function alongside other handlers
  const handleDeleteEducation = async (id) => {
    if (window.confirm('Are you sure you want to delete this education content?')) {
      try {
        const response = await fetch(`http://localhost:5000/admin/deleteEducation/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('adminToken')}`
          }
        });

        if (response.ok) {
          toast.success('Education content deleted successfully');
          fetchEducation(); // Refresh the education list
        } else {
          throw new Error('Failed to delete education content');
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  // Add image preview component
  const ImagePreview = ({ image, contentType }) => {
    if (!image) return null;

    const imageUrl = `data:${contentType};base64,${Buffer.from(image).toString('base64')}`;
    return (
      <div className="relative">
        <img 
          src={imageUrl} 
          alt="Preview" 
          className="w-full h-40 object-cover rounded-lg"
        />
      </div>
    );
  };

  // Update the recycle request image display function
  const DisplayImage = ({ imageData, contentType }) => {
    if (!imageData || !contentType) return null;
    
    try {
      const base64String = Buffer.from(imageData).toString('base64');
      const imageUrl = `data:${contentType};base64,${base64String}`;
      return (
        <img 
          src={imageUrl}
          alt="Device"
          className="w-full h-40 object-cover rounded-lg"
        />
      );
    } catch (error) {
      console.error('Error converting image:', error);
      return null;
    }
  };

  // Login Modal Component
  const LoginModal = () => {
    const handleFormClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleInputChange = (e) => {
      e.stopPropagation();
      const { name, value } = e.target;
      setLoginForm(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      e.stopPropagation();
      setLoading(true);
      
      try {
        const response = await fetch('http://localhost:5000/admin/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(loginForm)
        });

        if (response.ok) {
          const data = await response.json();
          sessionStorage.setItem('adminToken', data.token);
          setIsAuthenticated(true);
          setShowLoginModal(false);
          toast.success('Login successful');
          fetchDashboardStats();
          fetchRecycleRequests();
        } else {
          throw new Error('Login failed');
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div 
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        onClick={handleFormClick}
      >
        <div 
          className="bg-white rounded-lg p-8 w-96 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>
          <form 
            onSubmit={handleSubmit} 
            onClick={(e) => e.stopPropagation()}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={loginForm.username}
                onChange={handleInputChange}
                onClick={(e) => e.stopPropagation()}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
                autoComplete="off"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={loginForm.password}
                onChange={handleInputChange}
                onClick={(e) => e.stopPropagation()}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              onClick={(e) => e.stopPropagation()}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                       disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Logging in...
                </div>
              ) : (
                'Login'
              )}
            </button>
          </form>
        </div>
      </div>
    );
  };

  const RequestDetailsModal = ({ request, onClose }) => {
    const downloadImage = (imageData, contentType, index) => {
      const blob = new Blob([Buffer.from(imageData)], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `device-image-${index + 1}.${contentType.split('/')[1]}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    };

    const renderImage = (imageData) => {
      try {
        const base64String = btoa(
          new Uint8Array(imageData).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ''
          )
        );
        return `data:image/jpeg;base64,${base64String}`;
      } catch (error) {
        console.error('Error converting image:', error);
        return null;
      }
    };

    return (
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
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Images</h3>
              <div className="grid grid-cols-2 gap-4">
                {request.images.map((image, index) => {
                  const imageUrl = renderImage(image.data);
                  return imageUrl ? (
                    <div key={index} className="relative group">
                      <img
                        src={imageUrl}
                        alt={`Device ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 
                                    transition-all duration-200 flex items-center justify-center 
                                    opacity-0 group-hover:opacity-100">
                        <button
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = imageUrl;
                            link.download = `device-image-${index + 1}.jpg`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg 
                                   transform transition-all duration-200 hover:scale-105"
                        >
                          Download Image
                        </button>
                      </div>
                    </div>
                  ) : null;
                })}
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
  };

  // Update the education tab content
  const EducationTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Add New Content</h3>
        <form onSubmit={handleAddEducation} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={educationForm.title}
            onChange={(e) => setEducationForm({ ...educationForm, title: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            placeholder="Description"
            value={educationForm.description}
            onChange={(e) => setEducationForm({ ...educationForm, description: e.target.value })}
            className="w-full p-2 border rounded"
            rows="4"
            required
          />
          <select
            value={educationForm.category}
            onChange={(e) => setEducationForm({ ...educationForm, category: e.target.value })}
            className="w-full p-2 border rounded"
            required
          >
            <option>Basic</option>
            <option>Advanced</option>
            <option>Expert</option>
          </select>
          <input
            type="url"
            placeholder="Article Link"
            value={educationForm.articleLink}
            onChange={(e) => setEducationForm({ ...educationForm, articleLink: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="url"
            placeholder="Image URL"
            value={educationForm.imageUrl}
            onChange={(e) => setEducationForm({ ...educationForm, imageUrl: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Add Content
          </button>
        </form>
      </div>

      {/* Current Education Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Current Education Content</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {educationList.map(item => (
            <div key={item._id} className="border rounded-lg p-4">
              {/* <img 
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              /> */}
              <h4 className="font-semibold">{item.title}</h4>
              <p className="text-sm text-gray-600 mb-2">{item.category}</p>
              <p className="text-sm text-gray-500 mb-4">{item.description.substring(0, 100)}...</p>
              <div className="flex justify-between items-center">
                <a 
                  href={item.articleLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700"
                >
                  Read More
                </a>
                <button
                  onClick={() => handleDeleteEducation(item._id)}
                  className="text-red-600 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Update the events tab content
  const EventsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Add New Event</h3>
        <form onSubmit={handleAddEvent} className="space-y-4">
          <input
            type="text"
            placeholder="Event Name"
            value={eventForm.title}
            onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="date"
            value={eventForm.date}
            onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <select
            value={eventForm.category}
            onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Category</option>
            {EVENT_CATEGORIES.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <input
            type="url"
            placeholder="Registration Link"
            value={eventForm.registrationLink}
            onChange={(e) => setEventForm({ ...eventForm, registrationLink: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            placeholder="Description"
            value={eventForm.description}
            onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
            className="w-full p-2 border rounded"
            rows="4"
            required
          />
          <input
            type="url"
            placeholder="Image URL"
            value={eventForm.imageUrl}
            onChange={(e) => setEventForm({ ...eventForm, imageUrl: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Create Event
          </button>
        </form>
      </div>

      {/* Events List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Current Events</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map(event => (
            <div key={event._id} className="border rounded-lg p-4">
              <ImagePreview image={event.image.data} contentType={event.image.contentType} />
              <h4 className="font-semibold mt-2">{event.title}</h4>
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
  );

  // Show login modal if not authenticated
  if (!isAuthenticated) {
    return <LoginModal />;
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

          {activeTab === 'education' && <EducationTab />}

          {activeTab === 'events' && <EventsTab />}
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
