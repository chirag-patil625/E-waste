const mongoose = require('mongoose');

const dashboardSchema = new mongoose.Schema({
    userId: {
        type: String,  
        required: true,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    eventsJoined: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Dashboard', dashboardSchema);
