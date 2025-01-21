const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    pointsCost: {
        type: Number,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    available: {
        type: Boolean,
        default: true
    },
    category: {
        type: String,
        enum: ['Voucher', 'Product', 'Service'],
        required: true
    }
}, { timestamps: true });

const Reward = mongoose.model('Reward', rewardSchema);
module.exports = Reward;
