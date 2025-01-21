const mongoose = require('mongoose');

const rewardRequestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rewardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reward',
        required: true
    },
    rewardName: {
        type: String,
        required: true
    },
    pointsCost: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    deliveryAddress: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    notes: String,
    processedAt: Date
}, { timestamps: true });

const RewardRequest = mongoose.model('RewardRequest', rewardRequestSchema);
module.exports = RewardRequest;
