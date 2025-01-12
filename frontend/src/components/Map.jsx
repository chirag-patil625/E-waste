import React, { useState, useEffect, useRef } from "react";

const Map = () => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  //0PWMf4bYeUmSAi1IymzYSTR3vdeSYO9KYSncBf9E8oE
  const hereApiKey = "";

  // Initialize map
  useEffect(() => {
    // Default location (Mumbai)
    const defaultLocation = { lat: 19.0760, lng: 72.8777 };

    const initMap = () => {
      try {
        // Check if the map container exists
        if (!mapContainerRef.current) {
          console.error("Map container not found");
          setError("Map container not found");
          setIsLoading(false);
          return;
        }

        // Initialize the Platform object
        const platform = new window.H.service.Platform({
          apikey: hereApiKey
        });

        const defaultLayers = platform.createDefaultLayers();

        // Create map instance
        const newMap = new window.H.Map(
          mapContainerRef.current,
          defaultLayers.vector.normal.map,
          {
            center: defaultLocation,
            zoom: 12,
            pixelRatio: window.devicePixelRatio || 1
          }
        );

        // Enable the event system on the map instance
        const mapEvents = new window.H.mapevents.MapEvents(newMap);

        // Add default UI components
        const ui = window.H.ui.UI.createDefault(newMap, defaultLayers);

        // Enable map interaction (pan, zoom, etc.)
        new window.H.mapevents.Behavior(mapEvents);

        // Get user's location if available
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              };
              
              // Add user location marker
              const userMarker = new window.H.map.Marker(userLocation);
              newMap.addObject(userMarker);
              newMap.setCenter(userLocation);

              // Add facility markers
              const facilities = [
                { name: "E-Waste Center 1", location: { lat: userLocation.lat + 0.01, lng: userLocation.lng + 0.01 } },
                { name: "Recycling Hub", location: { lat: userLocation.lat - 0.01, lng: userLocation.lng - 0.01 } }
              ];

              facilities.forEach(facility => {
                const marker = new window.H.map.Marker(facility.location);
                newMap.addObject(marker);
              });
            },
            (error) => {
              console.warn("Geolocation error:", error);
              // Add default marker for Mumbai
              const marker = new window.H.map.Marker(defaultLocation);
              newMap.addObject(marker);
            }
          );
        }

        // Handle window resize
        window.addEventListener('resize', () => newMap.getViewPort().resize());

        setMap(newMap);
        setIsLoading(false);

        return () => {
          if (newMap) {
            newMap.dispose();
          }
        };
      } catch (err) {
        console.error('Map initialization error:', err);
        setError('Unable to initialize map. Please try again.');
        setIsLoading(false);
      }
    };

    // Wait for HERE Maps scripts to load
    const waitForHereMaps = setInterval(() => {
      if (window.H && window.H.Map) {
        clearInterval(waitForHereMaps);
        initMap();
      }
    }, 100);

    return () => {
      clearInterval(waitForHereMaps);
      if (map) {
        map.dispose();
      }
    };
  }, []);

  if (error) {
    return (
      <div className="w-full h-[500px] rounded-xl overflow-hidden shadow-lg bg-gray-100 flex items-center justify-center">
        <div className="text-center p-4">
          <p className="text-red-500 font-medium mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
          >
            Retry Loading Map
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
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
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default Map;