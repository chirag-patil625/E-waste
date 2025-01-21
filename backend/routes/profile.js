const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Recycle = require('../models/Recycle');
const bcrypt = require('bcryptjs');
const auth = require('../middleware/authenticateToken');

router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: error.message });
    }
});

router.put('/profile', auth, async (req, res) => {
    try {
        const { fullName, phone } = req.body;
        const updates = {};
        
        if (fullName) updates.fullName = fullName;
        if (phone) updates.phone = phone;
        
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updates },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            message: 'Profile updated successfully',
            user
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: error.message });
    }
});

router.put('/change-password', auth, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const validPassword = await bcrypt.compare(oldPassword, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ message: error.message });
    }
});

// router.get('/recycling-history', auth, async (req, res) => {
//     try {
//         const history = await Recycle.find({ 
//             'submittedBy.email': req.user.email 
//         })
//         .select('name deviceType quantity status tokens createdAt')
//         .sort({ createdAt: -1 });

//         res.json(history);
//     } catch (error) {
//         console.error('Error fetching recycling history:', error);
//         res.status(500).json({ message: error.message });
//     }
// });

module.exports = router;
