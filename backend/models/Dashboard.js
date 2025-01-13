const mongoose = require('mongoose');

const dashboardSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    totalPoints: {
        type: Number,
        default: 0
    },
    itemsRecycled: {
        type: Number,
        default: 0
    },
    eventsJoined: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// Make sure to name the model 'Dashboard' explicitly
const Dashboard = mongoose.model('Dashboard', dashboardSchema);
module.exports = Dashboard;  // Export the model directly
