import React from 'react';
import { Link } from 'react-router-dom';
import aboutImage from '../assets/aboutimg.svg';
export default function Home() {
  return (
    <div className="min-h-screen relative">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-green-100 py-20 relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                Responsible E-Waste Management for a Greener Future
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Join us in creating a sustainable future by properly disposing of your electronic waste. Find nearby facilities, earn rewards, and make a difference.
              </p>
              <div className="flex space-x-4">
                <Link to="/find-facility" className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 transition duration-300">
                  Find Facility
                </Link>
                <Link to="/learn" className="border-2 border-green-500 text-green-500 px-8 py-3 rounded-lg hover:bg-green-500 hover:text-white transition duration-300">
                  Learn More
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <img 
                src={aboutImage} 
                alt="E-waste recycling" 
                className="absolute right-10 h-[750px] object-contain z-10"
                style={{ top: '-340px' }}  // Adjust this value to align vertically as needed
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="text-4xl font-bold text-green-600 mb-2">50M+</div>
              <div className="text-gray-600">Tons of E-waste Annually</div>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="text-4xl font-bold text-green-600 mb-2">17%</div>
              <div className="text-gray-600">Global Recycling Rate</div>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="text-4xl font-bold text-green-600 mb-2">$57B</div>
              <div className="text-gray-600">Raw Material Value</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">How We Help</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-green-500 text-4xl mb-4">📍</div>
              <h3 className="text-xl font-semibold mb-2">Locate Facilities</h3>
              <p className="text-gray-600">Find nearest e-waste collection centers and recycling facilities</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-green-500 text-4xl mb-4">🎓</div>
              <h3 className="text-xl font-semibold mb-2">Education</h3>
              <p className="text-gray-600">Learn about proper e-waste disposal and environmental impact</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-green-500 text-4xl mb-4">🎁</div>
              <h3 className="text-xl font-semibold mb-2">Reward Program</h3>
              <p className="text-gray-600">Earn rewards for responsible e-waste disposal</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our community of environmentally conscious individuals and start your recycling journey today.
          </p>
          <Link to="/signup" className="bg-white text-green-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition duration-300 inline-block">
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
}
