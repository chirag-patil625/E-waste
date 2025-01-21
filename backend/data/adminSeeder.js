// seedAdmin.js
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const connectToMongo = require('../db');
const bcrypt = require('bcryptjs');

const admins = [
    {
        username: "admin",
        password: "admin123"
    }
];

const seedAdmin = async () => {
    try {
        await connectToMongo();
        console.log('Connected to MongoDB...');
        const existingAdmin = await Admin.findOne({ username: "admin" });
        if (existingAdmin) {
            console.log('Admin already exists, skipping seeding.');
            return;
        }
        const hashedAdmins = await Promise.all(
            admins.map(async (admin) => ({
                ...admin,
                password: await bcrypt.hash(admin.password, 10)
            }))
        );

        await Admin.create(hashedAdmins);
        console.log('Admin created successfully!');

    } catch (err) {
        console.error('Error creating admin:', err.message);
    } finally {
        await mongoose.connection.close();
        console.log('MongoDB connection closed.');
        process.exit(0);
    }
};
seedAdmin();