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
const RewardRequest = require('../models/RewardRequest'); // Add this import
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

router.post('/addEvent', adminAuth, async (req, res) => {
    try {
        const { title, description, date, category, registrationLink, imageUrl } = req.body;
        
        if (!title || !description || !date || !category || !registrationLink || !imageUrl) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const newEvent = new Event({
            title,
            description,
            date,
            category,
            registrationLink,
            imageUrl
        });

        await newEvent.save();
        res.status(201).json({ message: 'Event created successfully', event: newEvent });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ error: 'Failed to create event: ' + error.message });
    }
});

router.post('/addEducation', adminAuth, async (req, res) => {
    try {
        const { title, description, category, articleLink, imageUrl } = req.body;

        if (!title || !description || !category || !articleLink || !imageUrl) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const newEducation = new Education({
            title,
            description,
            category,
            articleLink,
            imageUrl
        });

        await newEducation.save();
        res.status(201).json({ message: 'Education content created successfully', education: newEducation });
    } catch (error) {
        console.error('Error creating education content:', error);
        res.status(500).json({ error: 'Failed to create education content: ' + error.message });
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

router.get('/education', adminAuth, async (req, res) => {
    try {
        const education = await Education.find({});
        res.json(education);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch education content' });
    }
});

router.get('/events', adminAuth, async (req, res) => {
    try {
        const events = await Event.find({});
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

router.get('/dashboard-stats', adminAuth, async (req, res) => {
    try {
        const [pendingRequests, totalUsers] = await Promise.all([
            Recycle.countDocuments({ status: 'pending' }),
            User.countDocuments()
        ]);

        res.json({
            pendingRequests,
            totalUsers,
            // Remove pendingRewards for now since we're still setting up the rewards system
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
    }
});

// Get all reward requests
router.get('/reward-requests', adminAuth, async (req, res) => {
    try {
        const requests = await RewardRequest.find({})
            .populate('rewardId')
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        console.error('Error fetching reward requests:', error);
        res.status(500).json({ error: 'Failed to fetch reward requests' });
    }
});

// Update reward request status
router.patch('/reward-requests/:id', adminAuth, async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const request = await RewardRequest.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ error: 'Reward request not found' });
        }

        // Only process if the status is changing from pending
        if (request.status === 'pending') {
            request.status = status;
            request.processedAt = new Date();

            // If rejecting, mark any points used for this request as available again
            if (status === 'rejected') {
                await Recycle.updateMany(
                    {
                        'submittedBy.email': request.userId.email,
                        usedFor: request._id
                    },
                    {
                        $set: {
                            pointsUsed: false,
                            usedFor: null
                        }
                    }
                );
            }

            await request.save();
        }

        res.json({
            message: `Reward request ${status}`,
            request: request
        });
    } catch (error) {
        console.error('Error updating reward request:', error);
        res.status(500).json({ error: 'Failed to update reward request' });
    }
});

module.exports = router;
