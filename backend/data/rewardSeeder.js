const mongoose = require('mongoose');
const Reward = require('../models/Reward');
const connectToMongo = require('../db');

const rewards = [
    {
        name: "Eco-Friendly Water Bottle",
        description: "Stainless steel, reusable water bottle",
        pointsCost: 500,
        imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8",
        category: "Product",
        available: true
    },
    {
        name: "Shopping Voucher",
        description: "₹500 shopping voucher for eco-friendly stores",
        pointsCost: 1000,
        imageUrl: "https://images.unsplash.com/photo-1556742111-a301076d9d18",
        category: "Voucher",
        available: true
    },
    {
        name: "Solar Power Bank",
        description: "10000mAh solar-powered power bank",
        pointsCost: 1500,
        imageUrl: "https://images.unsplash.com/photo-1620813528266-ef4729a2e487",
        category: "Product",
        available: true
    }
];

const seedRewards = async () => {
    try {
        await connectToMongo();
        await Reward.deleteMany({}); 
        await Reward.insertMany(rewards);
        console.log('Rewards seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding rewards:', error);
        process.exit(1);
    }
};

seedRewards();
