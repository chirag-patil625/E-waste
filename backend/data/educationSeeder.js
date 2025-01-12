const mongoose = require('mongoose');
const Education = require('../models/Education');
const connectToMongo = require('../db');

const education = [
    {
        tittle: "Understanding E-Waste: A Comprehensive Guide",
        description: "Learn about different types of electronic waste and their environmental impact. Discover how proper disposal methods can make a difference.",
        image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        category: "Basics",
        articleLink: "/articles/understanding-ewaste"
    },
    {
        tittle: "Best Practices for E-Waste Recycling",
        description: "Expert tips on how to properly recycle different electronic devices. Learn about data security and preparation steps.",
        image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        category: "How-to",
        articleLink: "/articles/ewaste-recycling-practices"
    },
    {
        tittle: "Environmental Impact of E-Waste",
        description: "Understand how improper e-waste disposal affects our environment and what we can do to minimize the impact.",
        image: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        category: "Environment",
        articleLink: "/articles/environmental-impact"
    }
];

  const insertEducation = async () => {
    await connectToMongo(); // Connect to MongoDB

    try {
        await Education.insertMany(education); // Insert the fruits data
        console.log('Education data inserted successfully!');
    } catch (err) {
        console.error('Error inserting Education data:', err.message);
    } finally {
        mongoose.connection.close(); // Close the connection after insertion
    }
};

insertEducation();