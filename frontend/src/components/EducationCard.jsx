import React from 'react';

const EducationCard = ({ title, description, image, category, readTime }) => {
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
        <div className="flex items-center justify-between mb-3">
          <span className="px-3 py-1 bg-teal-100 text-teal-600 rounded-full text-sm font-medium">
            {category}
          </span>
          <span className="text-gray-500 text-sm">{readTime} min read</span>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 line-clamp-2">{description}</p>
        <button className="mt-4 text-teal-600 font-medium hover:text-teal-700 transition-colors duration-200">
          Read More →
        </button>
      </div>
    </div>
  );
};

export default EducationCard;
