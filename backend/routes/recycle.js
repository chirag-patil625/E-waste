const express = require('express');
const router = express.Router();
const Recycle = require('../models/Recycle');
const upload = require('../middleware/upload');

// POST route to create a new item with images
router.post('/recycle', upload.array('images', 5), async (req, res) => {
    try {
        const { name, deviceType, condition, quantity, description, submittedBy, address } = req.body;

        // Process uploaded images
        const images = req.files.map(file => ({
            data: file.buffer,
            contentType: file.mimetype
        }));

        // Create new item with images
        const newRecycle = new Recycle({
            name,
            deviceType,
            condition,
            quantity,
            description,
            images,
            submittedBy: JSON.parse(submittedBy), // Parse JSON string from form-data
            address: JSON.parse(address), // Parse JSON string from form-data
        });

        await newRecycle.save();
        res.status(201).json({ message: 'Item created successfully', itemId: newRecycle._id });

    } catch (error) {
        console.error('Error creating item:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET route to retrieve an item with images
router.get('/recycle/:id', async (req, res) => {
    try {
        const recycle = await Recycle.findById(req.params.id);
        if (!recycle) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.json(recycle);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;