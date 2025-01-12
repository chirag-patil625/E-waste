const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const adminAuth = require('../middleware/adminAuth');
const Admin = require('../models/Admin');
const Event = require('../models/Events');
const Education = require('../models/Education');

const JWT_SECRET = process.env.JWT_SECRET || 'thisisaverylongstringthatshouldbeusedasasecret';

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await Admin.findOne({ username });
        
        if (!admin) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { adminId: admin._id },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        res.json({ token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed: ' + error.message });
    }
});

router.post('/addEvent', adminAuth, async (req, res) => {
    try {
        const { title, description, date, image, category, registrationLink } = req.body;
        
        if (!title || !description || !date || !image || !category || !registrationLink) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const newEvent = new Event({
            title,
            description,
            date,
            image,
            category,
            registrationLink
        });

        await newEvent.save();
        res.status(201).json({ message: 'Event created successfully', event: newEvent });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create event' });
    }
});

router.post('/addEducation', adminAuth, async (req, res) => {
    try {
        const { tittle, description, image, category, articleLink } = req.body;
        
        if (!tittle || !description || !image || !category || !articleLink) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const newEducation = new Education({
            tittle,
            description,
            image,
            category,
            articleLink
        });

        await newEducation.save();
        res.status(201).json({ 
            message: 'Education article created successfully', 
            education: newEducation 
        });
    } catch (error) {
        console.error('Error creating education article:', error);
        res.status(500).json({ error: 'Failed to create education article' });
    }
});

router.delete('/deleteEducation/:id', adminAuth, async (req, res) => {
    try {
        const education = await Education.findById(req.params.id);
        if (!education) {
            return res.status(404).json({ error: 'Education article not found' });
        }

        await Education.findByIdAndDelete(req.params.id);
        res.json({ 
            message: 'Education article deleted successfully',
            deletedId: req.params.id 
        });
    } catch (error) {
        console.error('Error deleting education article:', error);
        res.status(500).json({ error: 'Failed to delete education article' });
    }
});

router.delete('/deleteEvent/:id', adminAuth, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        await Event.findByIdAndDelete(req.params.id);
        res.json({ 
            message: 'Event deleted successfully',
            deletedId: req.params.id 
        });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ error: 'Failed to delete event' });
    }
});

module.exports = router;
