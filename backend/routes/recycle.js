const express = require('express');
const router = express.Router();
const Recycle = require('../models/Recycle');
const upload = require('../middleware/upload');
const auth = require('../middleware/authenticateToken');

// Add auth middleware to the route
router.post('/recycle', auth, upload.array('images', 5), async (req, res) => {
    try {
        const { deviceType, condition, quantity, description, submittedBy, address } = req.body;

        // Create new item
        const newRecycle = new Recycle({
            name: JSON.parse(submittedBy).name, // Get name from submittedBy
            deviceType,
            condition,
            quantity,
            description,
            submittedBy: JSON.parse(submittedBy),
            address: JSON.parse(address),
            images: req.files ? req.files.map(file => ({
                data: file.buffer,
                contentType: file.mimetype
            })) : []
        });

        await newRecycle.save();
        res.status(201).json({ 
            message: 'Recycling request submitted successfully',
            itemId: newRecycle._id 
        });

    } catch (error) {
        console.error('Error creating recycle request:', error);
        res.status(500).json({ message: error.message });
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