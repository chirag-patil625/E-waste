import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Sample e-waste facilities data
const facilities = [
  {
    id: 1,
    name: "Eco Recyclers",
    position: [19.0760, 72.8777],
    address: "123 Green Street, Mumbai",
    phone: "+91 1234567890"
  },
  {
    id: 2,
    name: "Green E-Waste Solutions",
    position: [19.0825, 72.8900],
    address: "456 Tech Road, Mumbai",
    phone: "+91 9876543210"
  },
];

export default function Map() {
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Get user's location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      },
      () => {
        // Default to Mumbai if location access denied
        setUserLocation([19.0760, 72.8777]);
      }
    );
  }, []);

  if (!userLocation) {
    return (
      <div className="w-full h-[500px] rounded-xl overflow-hidden shadow-lg bg-gray-100 flex items-center justify-center">
        <div className="text-center p-4">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-teal-500 border-t-transparent mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden shadow-lg">
      <MapContainer
        center={userLocation}
        zoom={13}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* User location marker */}
        <Marker position={userLocation}>
          <Popup>You are here</Popup>
        </Marker>

        {/* Facility markers */}
        {facilities.map(facility => (
          <Marker key={facility.id} position={facility.position}>
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold">{facility.name}</h3>
                <p className="text-sm text-gray-600">{facility.address}</p>
                <p className="text-sm text-gray-600">{facility.phone}</p>
                <button 
                  onClick={() => {
                    window.open(
                      `https://www.openstreetmap.org/directions?from=${userLocation[0]},${userLocation[1]}&to=${facility.position[0]},${facility.position[1]}`,
                      '_blank'
                    );
                  }}
                  className="mt-2 px-3 py-1 bg-teal-500 text-white text-sm rounded hover:bg-teal-600"
                >
                  Get Directions
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}