const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');  // Add this line
const Dashboard = require('../models/Dashboard');
const Recycle = require('../models/Recycle');
const auth = require('../middleware/authenticateToken');

// Get dashboard stats
router.get('/stats', auth, async (req, res) => {
    try {
        if (!mongoose.models.Dashboard) {
            return res.status(500).json({ message: "Dashboard model not properly initialized" });
        }
        
        // Get or create dashboard
        let dashboard = await Dashboard.findOne({ userId: req.user.id });
        if (!dashboard) {
            dashboard = new Dashboard({ userId: req.user.id });
            await dashboard.save();
        }

        // Calculate recycling stats
        const recycleStats = await Recycle.aggregate([
            { $match: { 'submittedBy.email': req.user.email, status: 'approved' } },
            { $group: {
                _id: null,
                totalItems: { $sum: '$quantity' },
                totalTokens: { $sum: '$tokens' }
            }}
        ]);

        // Update dashboard with latest stats
        if (recycleStats.length > 0) {
            dashboard.totalPoints = recycleStats[0].totalTokens;
            dashboard.itemsRecycled = recycleStats[0].totalItems;
            await dashboard.save();
        }

        res.json({
            stats: {
                totalPoints: dashboard.totalPoints,
                itemsRecycled: dashboard.itemsRecycled,
                eventsJoined: dashboard.eventsJoined
            }
        });
    } catch (error) {
        console.error('Error in dashboard:', error);
        res.status(500).json({ message: error.message });
    }
});

// Increment events joined (to be called when user registers for an event)
router.post('/increment-event', auth, async (req, res) => {
    try {
        const dashboard = await Dashboard.findOneAndUpdate(
            { userId: req.user.id },
            { $inc: { eventsJoined: 1 } },
            { new: true, upsert: true }
        );

        res.json({ eventsJoined: dashboard.eventsJoined });
    } catch (error) {
        console.error('Error updating events joined:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;  // This line is crucial
