const mongoose = require('mongoose');

const renterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    role: {
        type: String,
        default: 'renter'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Renter', renterSchema);
