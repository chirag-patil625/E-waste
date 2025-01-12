import React, { useState } from 'react';
import EventCard from '../components/EventCard';

export default function Events() {
  // This would come from backend in future
  const events = [
    {
      id: 1,
      title: "E-Waste Collection Drive",
      date: "March 15, 2024",
      location: "Central Park, Mumbai",
      description: "Join us for our monthly e-waste collection drive. Bring your old electronics for responsible recycling.",
      image: "https://images.unsplash.com/photo-1576615278693-f8e095e37e01?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Collection Drive",
      registrationLink: "#"
    },
    {
      id: 2,
      title: "Electronics Recycling Workshop",
      date: "March 20, 2024",
      location: "Tech Hub, Delhi",
      description: "Learn about electronics recycling processes and how to prepare your devices for recycling.",
      image: "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Workshop",
      registrationLink: "#"
    },
    {
      id: 3,
      title: "Sustainability Conference",
      date: "April 5, 2024",
      location: "Green Convention Center, Bangalore",
      description: "A conference focused on sustainable e-waste management practices and future technologies.",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Conference",
      registrationLink: "#"
    }
  ];

  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', 'Collection Drive', 'Workshop', 'Conference', 'Awareness'];

  const filteredEvents = selectedCategory === 'All'
    ? events
    : events.filter(event => event.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 ">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-16 mb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Upcoming Events</h1>
            <p className="text-xl text-teal-100">
              Join our events and be part of the e-waste management revolution
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4">
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-teal-500 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-teal-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map(event => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="mt-20 bg-white rounded-xl p-8 shadow-lg">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Stay Updated</h3>
            <p className="text-gray-600 mb-6">
              Subscribe to our newsletter to receive updates about upcoming events
            </p>
            <div className="flex gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <button className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors duration-200">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
