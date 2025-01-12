const express = require('express');
const eventSchema = require('../models/Events');
const   router = express.Router();

router.get('/events', async (req, res) => {
    try{
        const events = await eventSchema.find();
        res.json(events);
    }catch(err){
        res.status(500).json({ error: 'Failed to fetch Events' });
    }
});

module.exports = router;