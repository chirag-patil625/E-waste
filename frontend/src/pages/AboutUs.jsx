import React from 'react';
import { Link } from 'react-router-dom';
import aboutImage from '../assets/about.jpg'; // Make sure this image exists

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-500 to-teal-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About E-Waste Management</h1>
            <p className="text-xl text-teal-100">
              Making electronic waste disposal sustainable and accessible for everyone
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-800">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                We're dedicated to creating a sustainable future by revolutionizing how electronic waste is managed. Our platform connects individuals and businesses with certified e-waste recycling facilities, making responsible disposal easy and rewarding.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <div className="text-3xl font-bold text-teal-600 mb-2">1M+</div>
                  <div className="text-sm text-gray-600">Devices Recycled</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <div className="text-3xl font-bold text-teal-600 mb-2">500+</div>
                  <div className="text-sm text-gray-600">Collection Centers</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src={aboutImage} 
                alt="About E-Waste" 
                className="w-full max-w-lg mx-auto object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-teal-500 text-4xl mb-4">🌱</div>
              <h3 className="text-xl font-semibold mb-2">Sustainability</h3>
              <p className="text-gray-600">Promoting environmentally responsible disposal and recycling practices</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-teal-500 text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-gray-600">Building a network of environmentally conscious individuals and businesses</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-teal-500 text-4xl mb-4">💡</div>
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="text-gray-600">Leveraging technology to make e-waste management efficient and accessible</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-teal-600 to-emerald-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Mission</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Be part of the solution for responsible e-waste management. Together, we can make a difference.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/find-facility"
              className="bg-white text-teal-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition duration-300"
            >
              Find Facility
            </Link>
            <Link
              to="/signup"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-teal-600 transition duration-300"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
