import React from 'react';

const EventCard = ({ title, date, location, description, image, category, registrationLink }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <span className="px-3 py-1 bg-teal-100 text-teal-600 rounded-full text-sm font-medium">
            {category}
          </span>
          <div className="text-right">
            <p className="text-gray-500 text-sm">{date}</p>
            <p className="text-gray-600 text-sm mt-1">{location}</p>
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
        <a
          href={registrationLink}
          className="inline-block w-full text-center bg-gradient-to-r from-teal-500 to-emerald-500 text-white py-2 rounded-lg hover:from-teal-600 hover:to-emerald-600 transition-all duration-200"
        >
          Register Now
        </a>
      </div>
    </div>
  );
};

export default EventCard;
