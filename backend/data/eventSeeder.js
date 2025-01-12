const mongoose = require('mongoose');
const Events = require('../models/Events'); // Import the Event model
const connectToMongo = require('../db'); // Import the database connection function

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

const insertEvent = async () => {
    await connectToMongo(); // Connect to MongoDB

    try {
        await Events.insertMany(events); // Insert the fruits data
        console.log('Events data inserted successfully!');
    } catch (err) {
        console.error('Error inserting Events data:', err.message);
    } finally {
        mongoose.connection.close(); // Close the connection after insertion
    }
};

insertEvent();