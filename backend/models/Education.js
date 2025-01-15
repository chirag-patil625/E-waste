const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
    title: {
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
    articleLink: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Education = mongoose.model('Education', educationSchema);
module.exports = Education;