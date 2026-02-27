const Owner = require('../models/Owner');
const Renter = require('../models/Renter');
const Admin = require('../models/Admin');
const Property = require('../models/Property');

// Get Pending Owners (Admin only)
const getPendingOwners = async (req, res) => {
    try {
        const pendingOwners = await Owner.find({ isApproved: false })
            .select('-password')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: pendingOwners.length,
            data: pendingOwners
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Approve Owner (Admin only)
const approveOwner = async (req, res) => {
    try {
        const { id } = req.params;

        const owner = await Owner.findById(id);

        if (!owner) {
            return res.status(404).json({
                success: false,
                message: 'Owner not found'
            });
        }

        owner.isApproved = true;
        await owner.save();

        res.status(200).json({
            success: true,
            message: 'Owner approved successfully',
            data: owner
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Reject Owner (Admin only)
const rejectOwner = async (req, res) => {
    try {
        const { id } = req.params;

        const owner = await Owner.findByIdAndDelete(id);

        if (!owner) {
            return res.status(404).json({
                success: false,
                message: 'Owner not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Owner rejected and removed'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get All Users (Admin only)
const getAllUsers = async (req, res) => {
    try {
        const renters = await Renter.find().select('-password');
        const owners = await Owner.find().select('-password');
        const admins = await Admin.find().select('-password');

        res.status(200).json({
            success: true,
            data: {
                renters,
                owners,
                admins
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete Any Property (Admin only)
const deleteAnyProperty = async (req, res) => {
    try {
        const { id } = req.params;

        const property = await Property.findByIdAndDelete(id);

        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Property deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getPendingOwners,
    approveOwner,
    rejectOwner,
    getAllUsers,
    deleteAnyProperty
};
