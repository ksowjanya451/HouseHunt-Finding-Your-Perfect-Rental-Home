const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    renterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Renter',
        required: true
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Owner',
        required: true
    },
    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
        required: true
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required']
    },
    message: {
        type: String,
        default: ''
    },
    moveInDate: {
        type: Date,
        required: [true, 'Move-in date is required']
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);
