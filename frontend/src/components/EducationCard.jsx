import React from 'react';

const EducationCard = ({ tittle, description, image, category, articleLink }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="h-48 overflow-hidden">
        <img 
          src={image} 
          alt={tittle} 
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x200?text=Article+Image';
          }}
        />
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="px-3 py-1 bg-teal-100 text-teal-600 rounded-full text-sm font-medium">
            {category}
          </span>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{tittle}</h3>
        <p className="text-gray-600 line-clamp-2">{description}</p>
        <a 
          href={articleLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-teal-600 font-medium hover:text-teal-700 transition-colors duration-200"
        >
          Read More →
        </a>
      </div>
    </div>
  );
};

export default EducationCard;
