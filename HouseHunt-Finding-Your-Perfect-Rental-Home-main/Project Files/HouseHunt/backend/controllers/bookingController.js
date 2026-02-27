const Booking = require('../models/Booking');
const Property = require('../models/Property');

// Create Booking Request (Renter only)
const createBookingRequest = async (req, res) => {
    try {
        const renterId = req.user.id;
        const { propertyId, phone, message, moveInDate } = req.body;

        // Check if property exists
        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found'
            });
        }

        // Create booking
        const booking = await Booking.create({
            renterId,
            ownerId: property.ownerId,
            propertyId,
            phone,
            message,
            moveInDate,
            status: 'pending'
        });

        const populatedBooking = await Booking.findById(booking._id)
            .populate('renterId', 'name email')
            .populate('ownerId', 'name email')
            .populate('propertyId', 'title location rent');

        res.status(201).json({
            success: true,
            message: 'Booking request sent successfully',
            data: populatedBooking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Renter's Bookings
const getRenterBookings = async (req, res) => {
    try {
        const renterId = req.user.id;

        const bookings = await Booking.find({ renterId })
            .populate('ownerId', 'name email')
            .populate('propertyId', 'title location rent images')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Owner's Booking Requests
const getOwnerBookingRequests = async (req, res) => {
    try {
        const ownerId = req.user.id;

        const bookings = await Booking.find({ ownerId })
            .populate('renterId', 'name email')
            .populate('propertyId', 'title location rent images')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Approve Booking Request (Owner only)
const approveBookingRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const ownerId = req.user.id;

        const booking = await Booking.findById(id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Check if the owner owns this booking
        if (booking.ownerId.toString() !== ownerId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to approve this booking'
            });
        }

        booking.status = 'approved';
        await booking.save();

        const updatedBooking = await Booking.findById(id)
            .populate('renterId', 'name email')
            .populate('propertyId', 'title location rent');

        res.status(200).json({
            success: true,
            message: 'Booking approved successfully',
            data: updatedBooking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Reject Booking Request (Owner only)
const rejectBookingRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const ownerId = req.user.id;

        const booking = await Booking.findById(id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Check if the owner owns this booking
        if (booking.ownerId.toString() !== ownerId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to reject this booking'
            });
        }

        booking.status = 'rejected';
        await booking.save();

        const updatedBooking = await Booking.findById(id)
            .populate('renterId', 'name email')
            .populate('propertyId', 'title location rent');

        res.status(200).json({
            success: true,
            message: 'Booking rejected',
            data: updatedBooking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createBookingRequest,
    getRenterBookings,
    getOwnerBookingRequests,
    approveBookingRequest,
    rejectBookingRequest
};
