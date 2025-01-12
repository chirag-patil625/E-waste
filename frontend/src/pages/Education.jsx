import React, { useState } from 'react';
import EducationCard from '../components/EducationCard';

export default function Education() {
  // This would come from backend in future
  const articles = [
    {
      id: 1,
      title: "Understanding E-Waste: A Comprehensive Guide",
      description: "Learn about different types of electronic waste and their environmental impact. Discover how proper disposal methods can make a difference.",
      image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Basics",
      readTime: 5
    },
    {
      id: 2,
      title: "Best Practices for E-Waste Recycling",
      description: "Expert tips on how to properly recycle different electronic devices. Learn about data security and preparation steps.",
      image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "How-to",
      readTime: 8
    },
    {
      id: 3,
      title: "Environmental Impact of E-Waste",
      description: "Understand how improper e-waste disposal affects our environment and what we can do to minimize the impact.",
      image: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Environment",
      readTime: 6
    },
    // Add more articles as needed
  ];

  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Basics', 'How-to', 'Environment', 'Tips'];

  const filteredArticles = selectedCategory === 'All' 
    ? articles 
    : articles.filter(article => article.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-teal-600 to-teal-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">E-Waste Education Hub</h1>
            <p className="text-xl text-teal-100">
              Discover resources and guides to better understand e-waste management and recycling
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
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

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map(article => (
            <EducationCard key={article.id} {...article} />
          ))}
        </div>
      </div>
    </div>
  );
}
