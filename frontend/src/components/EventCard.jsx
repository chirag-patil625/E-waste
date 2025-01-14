import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const EventCard = ({ title, description, image, category, registrationLink, _id }) => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [registering, setRegistering] = useState(false);

  const handleRegister = async () => {
    if (!isLoggedIn) {
      toast.error('Please login to register for events');
      navigate('/login');
      return;
    }

    setRegistering(true);
    try {
      const response = await fetch('http://localhost:5000/api/dashboard/increment-event', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ eventId: _id }) // Add event ID if needed
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to register for event');
      }

      // If successful, open registration link and show success message
      if (registrationLink) {
        window.open(registrationLink, '_blank');
      }
      
      toast.success('Successfully registered for event!');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message);
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x200?text=Event+Image';
          }}
        />
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="px-3 py-1 bg-teal-100 text-teal-600 rounded-full text-sm font-medium">
            {category}
          </span>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 line-clamp-2 mb-4">{description}</p>
        <button
          onClick={handleRegister}
          disabled={registering}
          className="w-full bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {registering ? 'Registering...' : 'Register Now'}
        </button>
      </div>
    </div>
  );
};

export default EventCard;
