const express = require('express');
const router = express.Router();
const auth = require('../middleware/authenticateToken'); // Make sure this path is correct
const Reward = require('../models/Reward');
const User = require('../models/User');
const Recycle = require('../models/Recycle');
const RewardRequest = require('../models/RewardRequest');
const mongoose = require('mongoose');

// Debug middleware
router.use((req, res, next) => {
  console.log('Reward Route:', req.method, req.path);
  next();
});

// Get all available rewards
router.get('/', auth, async (req, res) => {
    try {
        console.log('Fetching rewards');
        const rewards = await Reward.find({ available: true });
        console.log('Found rewards:', rewards.length);
        res.status(200).json(rewards);
    } catch (error) {
        console.error('Error fetching rewards:', error);
        res.status(500).json({ error: 'Failed to fetch rewards' });
    }
});

// Update the user-stats route to include unused points
router.get('/user-stats', auth, async (req, res) => {
    try {
        const recycleRequests = await Recycle.find({ 
            'submittedBy.email': req.user.email,
            status: 'approved'
        });

        const unusedPoints = await Recycle.aggregate([
            {
                $match: {
                    'submittedBy.email': req.user.email,
                    status: 'approved',
                    pointsUsed: { $ne: true }
                }
            },
            {
                $group: {
                    _id: null,
                    totalUnusedPoints: { $sum: '$tokens' }
                }
            }
        ]);

        const stats = {
            totalPoints: unusedPoints[0]?.totalUnusedPoints || 0,
            itemsRecycled: recycleRequests.length,
            rewardsClaimed: await RewardRequest.countDocuments({ userId: req.user._id })
        };

        console.log('User stats:', stats);
        res.json({ stats });
    } catch (error) {
        console.error('Error in user-stats:', error);
        res.status(500).json({ error: 'Failed to fetch user stats' });
    }
});

// Redeem a reward
router.post('/redeem/:rewardId', auth, async (req, res) => {
    try {
        if (!req.body || !req.body.address || !req.body.phone) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const { address, phone, notes } = req.body;
        const userId = new mongoose.Types.ObjectId(req.user._id);
        const rewardId = new mongoose.Types.ObjectId(req.params.rewardId);
        
        console.log('Processing redemption for user:', req.user.email);

        // Find reward first to get the cost
        const reward = await Reward.findById(rewardId);
        if (!reward) {
            return res.status(404).json({ error: 'Reward not found' });
        }

        // Check if user has already redeemed this reward
        const existingRequest = await RewardRequest.findOne({
            userId: userId,
            rewardId: rewardId
        });

        if (existingRequest) {
            return res.status(400).json({ error: 'You have already redeemed this reward' });
        }

        // Calculate total available points from approved recycles
        const pointsData = await Recycle.aggregate([
            {
                $match: {
                    'submittedBy.email': req.user.email,
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

        // Calculate points already used in previous redemptions
        const usedPointsData = await RewardRequest.aggregate([
            {
                $match: {
                    userId: userId,
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

        const totalPoints = pointsData[0]?.totalPoints || 0;
        const usedPoints = usedPointsData[0]?.usedPoints || 0;
        const availablePoints = totalPoints - usedPoints;

        console.log('Total points:', totalPoints);
        console.log('Used points:', usedPoints);
        console.log('Available points:', availablePoints);
        console.log('Required points:', reward.pointsCost);

        if (availablePoints < reward.pointsCost) {
            return res.status(400).json({ 
                error: 'Insufficient points',
                required: reward.pointsCost,
                available: availablePoints
            });
        }

        // Create redemption request
        const rewardRequest = new RewardRequest({
            userId,
            rewardId: reward._id,
            rewardName: reward.name,
            pointsCost: reward.pointsCost,
            deliveryAddress: address,
            phone,
            notes,
            status: 'pending'
        });

        const savedRequest = await rewardRequest.save();

        res.status(200).json({
            success: true,
            message: 'Reward redeemed successfully',
            remainingPoints: availablePoints - reward.pointsCost,
            requestId: savedRequest._id
        });

    } catch (error) {
        console.error('Redemption error:', error);
        res.status(500).json({ error: 'Failed to process redemption' });
    }
});

// Get user's claimed rewards
router.get('/my-requests', auth, async (req, res) => {
    try {
        console.log('Fetching user requests for:', req.user._id);
        const requests = await RewardRequest.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .populate('rewardId');
        console.log('Found requests:', requests.length);
        res.status(200).json(requests);
    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).json({ error: 'Failed to fetch reward requests' });
    }
});

module.exports = router;
