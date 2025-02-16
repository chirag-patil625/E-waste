const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); 
const Dashboard = require('../models/Dashboard');
const Recycle = require('../models/Recycle');
const RewardRequest = require('../models/RewardRequest'); // Add this import
const auth = require('../middleware/authenticateToken');

router.get('/stats', auth, async (req, res) => {
    try {
        // Get total points and items recycled
        const recycleStats = await Recycle.aggregate([
            {
                $match: {
                    'submittedBy.email': req.user.email,
                    status: 'approved'
                }
            },
            {
                $group: {
                    _id: null,
                    totalPoints: { $sum: '$tokens' },
                    itemsRecycled: { $sum: '$quantity' }
                }
            }
        ]);

        // Get used points from reward requests
        const usedPointsData = await RewardRequest.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(req.user.id),
                    status: { $ne: 'rejected' }
                }
            },
            {
                $group: {
                    _id: null,
                    usedPoints: { $sum: '$pointsCost' }
                }
            }
        ]);

        // Calculate available points
        const totalPoints = recycleStats[0]?.totalPoints || 0;
        const usedPoints = usedPointsData[0]?.usedPoints || 0;
        const availablePoints = totalPoints - usedPoints;

        // Get or create dashboard for events
        let dashboard = await Dashboard.findOne({
            $or: [
                { userId: req.user.id },
                { user: req.user.id }
            ]
        });

        if (!dashboard) {
            dashboard = new Dashboard({ 
                userId: req.user.id,
                user: req.user.id,
                eventsJoined: 0 
            });
            await dashboard.save();
        }

        const stats = {
            totalPoints: availablePoints,
            itemsRecycled: recycleStats[0]?.itemsRecycled || 0,
            eventsJoined: dashboard.eventsJoined,
            rewardsClaimed: await RewardRequest.countDocuments({
                userId: req.user.id,
                status: { $ne: 'rejected' }
            })
        };

        res.json({ stats });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
});

router.post('/increment-event', auth, async (req, res) => {
    try {
        console.log('User ID:', req.user.id); // Add logging

        let dashboard = await Dashboard.findOneAndUpdate(
            { 
                $or: [
                    { userId: req.user.id },
                    { user: req.user.id }
                ]
            },
            { 
                $inc: { eventsJoined: 1 },
                $setOnInsert: { 
                    userId: req.user.id,
                    user: req.user.id
                }
            },
            { 
                new: true, 
                upsert: true 
            }
        );

        console.log('Updated Dashboard:', dashboard);

        if (!dashboard) {
            throw new Error('Failed to update dashboard');
        }

        res.json({ 
            success: true,
            eventsJoined: dashboard.eventsJoined
        });
    } catch (error) {
        console.error('Error incrementing events:', error);
        res.status(500).json({ 
            success: false,
            message: error.message || 'Failed to increment events'
        });
    }
});

module.exports = router;