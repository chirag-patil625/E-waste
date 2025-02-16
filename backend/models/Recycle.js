const mongoose = require('mongoose');

const recycleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    deviceType: {
        type: String,
        required: true
    },
    condition: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
    description: {
        type: String,
        required: true
    },
    images: [{
        data: Buffer,
        contentType: String
    }],
    submittedBy: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true }
    },
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        country: { type: String, required: true }
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    tokens: {
        type: Number,
        default: 0
    },
    reviewedAt: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    pointsUsed: {
        type: Boolean,
        default: false
    },
    usedFor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RewardRequest'
    }
}, { timestamps: true });

module.exports = mongoose.model('Recycle', recycleSchema);
