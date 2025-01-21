const express = require('express');
const router = express.Router();
const auth = require('../middleware/authenticateToken'); // Make sure this path is correct
const Reward = require('../models/Reward');
const User = require('../models/User');
const Recycle = require('../models/Recycle');
const RewardRequest = require('../models/RewardRequest');

// Debug middleware
router.use((req, res, next) => {
  console.log('Reward Route:', req.method, req.path);
  next();
});

// Get all available rewards
router.get('/rewards', auth, async (req, res) => {
    try {
        const rewards = await Reward.find({ available: true });
        res.json(rewards);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch rewards' });
    }
});

// Get user points and stats
router.get('/user-stats', auth, async (req, res) => {
    try {
        console.log('User ID from token:', req.user._id); // Debug log

        const recycleRequests = await Recycle.find({ 
            'submittedBy.userId': req.user._id,
            status: 'approved'
        });

        console.log('Found recycle requests:', recycleRequests.length); // Debug log

        const stats = {
            totalPoints: recycleRequests.reduce((sum, request) => sum + (request.tokens || 0), 0),
            itemsRecycled: recycleRequests.reduce((sum, request) => sum + request.quantity, 0),
            totalRequests: recycleRequests.length,
            rewardsClaimed: 0 // You might want to add a rewards claimed collection later
        };

        console.log('Sending stats:', stats); // Debug log
        res.json(stats);
    } catch (error) {
        console.error('Error in user-stats:', error); // Debug log
        res.status(500).json({ 
            error: 'Failed to fetch user stats',
            details: error.message 
        });
    }
});

// Redeem a reward
router.post('/redeem/:rewardId', auth, async (req, res) => {
    try {
        console.log('Redeem request body:', req.body); // Debug log
        console.log('User ID:', req.user._id); // Debug log
        console.log('Reward ID:', req.params.rewardId); // Debug log

        const { address, phone, notes } = req.body;

        // Validate required fields
        if (!address || !phone) {
            return res.status(400).json({ error: 'Address and phone are required' });
        }

        const reward = await Reward.findById(req.params.rewardId);
        if (!reward || !reward.available) {
            return res.status(404).json({ error: 'Reward not found or unavailable' });
        }

        // Check user points
        const userStats = await Recycle.aggregate([
            {
                $match: {
                    'submittedBy.userId': req.user._id,
                    status: 'approved'
                }
            },
            {
                $group: {
                    _id: null,
                    totalPoints: { $sum: '$tokens' }
                }
            }
        ]);

        const totalPoints = userStats[0]?.totalPoints || 0;
        console.log('User total points:', totalPoints); // Debug log

        if (totalPoints < reward.pointsCost) {
            return res.status(400).json({ error: 'Insufficient points' });
        }

        // Create redemption request
        const rewardRequest = new RewardRequest({
            userId: req.user._id,
            rewardId: reward._id,
            rewardName: reward.name,
            pointsCost: reward.pointsCost,
            deliveryAddress: address,
            phone: phone,
            notes: notes || ''
        });

        await rewardRequest.save();
        console.log('Reward request created:', rewardRequest); // Debug log

        // Return success response
        res.json({ 
            message: 'Reward redemption request submitted successfully',
            remainingPoints: totalPoints - reward.pointsCost,
            requestId: rewardRequest._id
        });
    } catch (error) {
        console.error('Redemption error:', error);
        res.status(500).json({ 
            error: 'Failed to redeem reward',
            details: error.message
        });
    }
});

// Get user's reward requests
router.get('/my-requests', auth, async (req, res) => {
    try {
        const requests = await RewardRequest.find({ userId: req.user._id })
            .sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch reward requests' });
    }
});

module.exports = router;
