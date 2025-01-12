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
        default: 'Pending',
        enum: ['Pending', 'Approved', 'Collected', 'Recycled']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Item = mongoose.model('Recycle', recycleSchema);
module.exports = Item;
