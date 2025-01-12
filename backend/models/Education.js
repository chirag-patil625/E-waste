const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
    tittle: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    articleLink: {
        type: String,
        required: true
    },

});

const Education = mongoose.model('Education', educationSchema);
module.exports = Education;