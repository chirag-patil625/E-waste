const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); 
const Dashboard = require('../models/Dashboard');
const Recycle = require('../models/Recycle');
const auth = require('../middleware/authenticateToken');

router.get('/stats', auth, async (req, res) => {
    try {
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

        const recycleStats = await Recycle.aggregate([
            { 
                $match: { 
                    'submittedBy.email': req.user.email 
                } 
            },
            { 
                $group: {
                    _id: null,
                    itemsRecycled: { $sum: '$quantity' },
                    totalPoints: { $sum: '$tokens' }
                }
            }
        ]);

        const stats = {
            totalPoints: recycleStats[0]?.totalPoints || 0,
            itemsRecycled: recycleStats[0]?.itemsRecycled || 0,
            eventsJoined: dashboard.eventsJoined
        };

        res.json({ stats });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: error.message });
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