const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type:{
        type: String,
        required: true
    },
    Item:{
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    points: {
        type: Number,
        required: true
    },
    facilty: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['waiting', 'cancel', 'completed'],
        default: 'waiting',
        required: true
    }
}, { timestamps: true });  // Add timestamps

const History = mongoose.model('History', historySchema);
module.exports = History;