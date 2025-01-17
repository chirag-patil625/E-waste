const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const adminAuth = require('../middleware/adminAuth');
const Admin = require('../models/Admin');
const Event = require('../models/Events');
const Education = require('../models/Education');
const Recycle = require('../models/Recycle');
const User = require('../models/User');  // Add this line
const upload = require('../middleware/upload');

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

// Add new event with image
router.post('/addEvent', adminAuth, upload.single('image'), async (req, res) => {
    try {
        const { title, description, date, category, registrationLink } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ error: 'Image is required' });
        }

        const newEvent = new Event({
            title,
            description,
            date,
            category,
            registrationLink,
            image: {
                data: req.file.buffer,
                contentType: req.file.mimetype
            }
        });

        await newEvent.save();
        res.status(201).json({ message: 'Event created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create event' });
    }
});

// Add new education content with image
router.post('/addEducation', adminAuth, upload.single('image'), async (req, res) => {
    try {
        const { title, description, category, articleLink } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ error: 'Image is required' });
        }

        const newEducation = new Education({
            title,
            description,
            category,
            articleLink,
            image: {
                data: req.file.buffer,
                contentType: req.file.mimetype
            }
        });

        await newEducation.save();
        res.status(201).json({ message: 'Education content created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create education content' });
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

// Get all recycle requests
router.get('/recycleRequests', adminAuth, async (req, res) => {
    try {
        const requests = await Recycle.find({})
            .select('name deviceType condition quantity description submittedBy address status tokens')
            .sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        console.error('Error fetching recycle requests:', error);
        res.status(500).json({ error: 'Failed to fetch recycle requests' });
    }
});

// Update recycle request status and assign tokens
router.patch('/recycleRequests/:id', adminAuth, async (req, res) => {
    try {
        const { status, tokens } = req.body;
        
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        if (status === 'approved' && (!tokens || tokens < 0)) {
            return res.status(400).json({ error: 'Valid tokens must be provided for approval' });
        }

        const request = await Recycle.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ error: 'Recycle request not found' });
        }

        const updatedRequest = await Recycle.findByIdAndUpdate(
            req.params.id,
            { 
                status,
                tokens: status === 'approved' ? tokens : 0,
                reviewedAt: new Date()
            },
            { new: true }
        );

        res.json({
            message: `Request ${status}`,
            request: updatedRequest
        });
    } catch (error) {
        console.error('Error updating recycle request:', error);
        res.status(500).json({ error: 'Failed to update recycle request' });
    }
});

// Get all education content
router.get('/education', adminAuth, async (req, res) => {
    try {
        const education = await Education.find({});
        res.json(education);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch education content' });
    }
});

// Get all events
router.get('/events', adminAuth, async (req, res) => {
    try {
        const events = await Event.find({});
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

// Get admin dashboard stats
router.get('/dashboard-stats', adminAuth, async (req, res) => {
    try {
        // Get pending requests count
        const pendingRequests = await Recycle.countDocuments({ status: 'pending' });
        
        // Get total users count
        const totalUsers = await User.countDocuments();

        res.json({
            pendingRequests,
            totalUsers
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
    }
});

module.exports = router;
