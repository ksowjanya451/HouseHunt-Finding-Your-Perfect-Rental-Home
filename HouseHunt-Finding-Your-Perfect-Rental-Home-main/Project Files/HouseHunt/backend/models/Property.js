const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required']
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    location: {
        type: String,
        required: [true, 'Location is required']
    },
    rent: {
        type: Number,
        required: [true, 'Rent is required']
    },
    propertyType: {
        type: String,
        enum: ['house', 'flat', 'room'],
        required: [true, 'Property type is required']
    },
    bedrooms: {
        type: Number,
        required: [true, 'Number of bedrooms is required']
    },
    bathrooms: {
        type: Number,
        required: [true, 'Number of bathrooms is required']
    },
    amenities: {
        type: [String],
        default: []
    },
    images: {
        type: [String],
        default: []
    },
    availability: {
        type: Boolean,
        default: true
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Owner',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Property', propertySchema);
