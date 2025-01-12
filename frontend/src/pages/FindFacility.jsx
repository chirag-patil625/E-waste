import React, { useState } from 'react';
import Map from '../components/Map';

export default function FindFacility() {
  const [searchQuery, setSearchQuery] = useState('');

  const facilities = [
    { id: 1, name: "E-Waste Center 1", address: "123 Green St, Eco City", distance: "2.5 km" },
    { id: 2, name: "Recycling Hub", address: "456 Tech Ave, Digital Town", distance: "4.1 km" },
    { id: 3, name: "Green Tech Disposal", address: "789 Earth Rd, Nature City", distance: "5.0 km" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Find E-Waste Facilities Near You</h1>
            <p className="text-lg text-gray-600">Locate the nearest e-waste collection centers and recycling facilities</p>
          </div>

          {/* Search and Map Container */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Search and Results */}
            <div className="lg:col-span-1 space-y-6">
              {/* Search Input */}
              <div className="bg-white p-4 rounded-lg shadow-md">
                <input
                  type="text"
                  placeholder="Search by location..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Facility List */}
              <div className="bg-white rounded-lg shadow-md divide-y divide-gray-100">
                {facilities.map(facility => (
                  <div key={facility.id} className="p-4 hover:bg-gray-50 transition-colors duration-150">
                    <h3 className="font-semibold text-gray-800">{facility.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{facility.address}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-teal-600">{facility.distance}</span>
                      <button className="px-4 py-1 text-sm bg-teal-500 text-white rounded-full hover:bg-teal-600 transition-colors duration-200">
                        Directions
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            <div className="lg:col-span-2">
              <Map />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
