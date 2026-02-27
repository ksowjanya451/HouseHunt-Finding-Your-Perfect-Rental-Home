const express = require('express');
const router = express.Router();
const {
    getPendingOwners,
    approveOwner,
    rejectOwner,
    getAllUsers,
    deleteAnyProperty
} = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');

// All routes are admin-only
router.get('/pendingOwners', authMiddleware, isAdmin, getPendingOwners);
router.put('/approveOwner/:id', authMiddleware, isAdmin, approveOwner);
router.put('/rejectOwner/:id', authMiddleware, isAdmin, rejectOwner);
router.get('/allUsers', authMiddleware, isAdmin, getAllUsers);
router.delete('/deleteProperty/:id', authMiddleware, isAdmin, deleteAnyProperty);

module.exports = router;
