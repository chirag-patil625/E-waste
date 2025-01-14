const mongoose = require('mongoose');

const dashboardSchema = new mongoose.Schema({
    userId: {
        type: String,  // Keep string type for direct user ID
        required: true,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,  // Keep ObjectId reference
        ref: 'User'
    },
    eventsJoined: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Dashboard', dashboardSchema);
