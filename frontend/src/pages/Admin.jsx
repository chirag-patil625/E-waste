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
    category: 'Basics',
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
      const response = await fetch('http://localhost:5000/admin/events', {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('adminToken')}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error(error.message);
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
    try {
      console.log('Sending data:', educationForm); // Add this line
      const response = await fetch('http://localhost:5000/admin/addEducation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(educationForm)
      });

      const data = await response.json();
      console.log('Response data:', data); // Add this line

      if (response.ok) {
        toast.success('Education content added successfully');
        setEducationForm({
          title: '',
          description: '',
          category: 'Basic',
          articleLink: '',
          imageUrl: ''  // Changed from image to imageUrl
        });
        fetchEducation();
      } else {
        throw new Error(data.error || 'Failed to add education content');
      }
    } catch (error) {
      console.error('Error:', error); // Add this line
      toast.error(error.message);
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/admin/addEvent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(eventForm)
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

  // Login Modal Component
  const LoginModal = () => {
    const [formState, setFormState] = useState({
      username: '',
      password: ''
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormState(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      
      try {
        const response = await fetch('http://localhost:5000/admin/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formState)
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
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg p-8 w-96 shadow-xl">
          <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formState.username}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
                autoComplete="off"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formState.password}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
                autoComplete="off"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
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
    // const downloadImage = (imageData, contentType, index) => {
    //   const blob = new Blob([Buffer.from(imageData)], { type: contentType });
    //   const url = window.URL.createObjectURL(blob);
    //   const a = document.createElement('a');
    //   a.href = url;
    //   a.download = `device-image-${index + 1}.${contentType.split('/')[1]}`;
    //   document.body.appendChild(a);
    //   a.click();
    //   document.body.removeChild(a);
    //   window.URL.revokeObjectURL(url);
    // };

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
  const EducationTab = () => {
    const [formState, setFormState] = useState({
      title: '',
      description: '',
      category: 'Basics',
      articleLink: '',
      imageUrl: ''
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormState(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch('http://localhost:5000/admin/addEducation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('adminToken')}`
          },
          body: JSON.stringify(formState)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to add education content');
        }

        toast.success('Education content added successfully');
        setFormState({
          title: '',
          description: '',
          category: 'Basics',
          articleLink: '',
          imageUrl: ''
        });
        fetchEducation();
      } catch (error) {
        console.error('Error:', error);
        toast.error(error.message);
      }
    };

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Add New Content</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="title"
              placeholder="Title"
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={formState.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows="4"
              required
            />
            <select
              name="category"
              value={formState.category}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option>Basics</option>
              <option>How-to</option>
              <option>Environment</option>
            </select>
            <input
              type="url"
              name="articleLink"
              placeholder="Article Link"
              value={formState.articleLink}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="url"
              name="imageUrl"
              placeholder="Image URL"
              value={formState.imageUrl}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
              Add Content
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Current Education Content</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {educationList.map(item => (
              <div key={item._id} className="border rounded-lg p-4">
                <img 
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
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
  };

  // Update the events tab content
  const EventsTab = () => {
    const [formState, setFormState] = useState({
      title: '',
      description: '',
      date: '',
      category: '',
      registrationLink: '',
      imageUrl: ''
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormState(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        console.log('Sending event data:', formState); // Debug log

        const response = await fetch('http://localhost:5000/admin/addEvent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('adminToken')}`
          },
          body: JSON.stringify(formState)
        });

        const data = await response.json();
        console.log('Server response:', data); // Debug log

        if (!response.ok) {
          throw new Error(data.error || 'Failed to add event');
        }

        toast.success('Event added successfully');
        setFormState({
          title: '',
          description: '',
          date: '',
          category: '',
          registrationLink: '',
          imageUrl: ''
        });
        fetchEvents();
      } catch (error) {
        console.error('Error adding event:', error);
        toast.error(error.message);
      }
    };

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Add New Event</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="title"
              placeholder="Event Name"
              value={formState.title}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="date"
              name="date"
              value={formState.date}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            <select
              name="category"
              value={formState.category}
              onChange={handleChange}
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
            <textarea
              name="description"
              placeholder="Description"
              value={formState.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows="4"
              required
            />
            <input
              type="url"
              name="registrationLink"
              placeholder="Registration Link"
              value={formState.registrationLink}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="url"
              name="imageUrl"
              placeholder="Image URL"
              value={formState.imageUrl}
              onChange={handleChange}
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
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h4 className="font-semibold mt-2">{event.title}</h4>
                <p className="text-sm text-gray-600 mb-2">
                  {new Date(event.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600 mb-2">{event.category}</p>
                <p className="text-sm text-gray-500 mb-4">
                  {event.description.substring(0, 100)}...
                </p>
                <div className="flex justify-between">
                  <a
                    href={event.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Register
                  </a>
                  <button
                    onClick={() => handleDeleteEvent(event._id)}
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
  };

  // Show login modal if not authenticated
  if (!isAuthenticated) {
    return <LoginModal />;
  }

  // Main return statement
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