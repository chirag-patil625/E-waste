const express = require('express');
const router = express.Router();
const Recycle = require('../models/Recycle');
const auth = require('../middleware/authenticateToken');

// Get user's history
router.get('/history', auth, async (req, res) => {
    try {
        const history = await Recycle.find({ 'submittedBy.email': req.user.email })
            .select('name deviceType quantity status tokens createdAt')
            .sort({ createdAt: -1 });
        
        
        res.json(history);
    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

// Update request status (cancel only)
router.patch('/history/:id', auth, async (req, res) => {
    try {
        const { status } = req.body;
        console.log('Request ID:', req.params.id);
        console.log('User email:', req.user.email);
        console.log('Requested status:', status);
        
        // First check if the request exists
        const existingRequest = await Recycle.findById(req.params.id);
        if (!existingRequest) {
            return res.status(404).json({ error: 'Request not found' });
        }

        // Check if the request belongs to the user
        if (existingRequest.submittedBy.email !== req.user.email) {
            return res.status(403).json({ error: 'Not authorized to cancel this request' });
        }

        // Check if the request is in pending status
        if (existingRequest.status !== 'pending') {
            return res.status(400).json({ error: 'Only pending requests can be cancelled' });
        }

        if (status !== 'rejected') {
            return res.status(400).json({ error: 'Can only cancel pending requests' });
        }

        const recycleRequest = await Recycle.findOneAndUpdate(
            { 
                _id: req.params.id, 
                'submittedBy.email': req.user.email,
                status: 'pending' 
            },
            { status: 'rejected' },
            { new: true }
        );

        console.log('Updated request:', recycleRequest);

        if (!recycleRequest) {
            return res.status(404).json({ error: 'Failed to update request' });
        }

        res.json({
            message: 'Request cancelled successfully',
            request: recycleRequest
        });
    } catch (error) {
        console.error('Error updating request:', error);
        res.status(500).json({ error: 'Failed to update request: ' + error.message });
    }
});

module.exports = router;
