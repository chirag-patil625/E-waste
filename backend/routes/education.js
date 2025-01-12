const express = require('express');
const educationSchema = require('../models/Education');

const router = express.Router();

router.get('/education', async (req, res) => {
    try {
        const education = await educationSchema.find();
        res.json(education);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch Education' });
    }
});

module.exports = router;