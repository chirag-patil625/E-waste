const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        data: Buffer,
        contentType: String
    },
    category: {
        type: String,
        required: true
    },
    registrationLink: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;