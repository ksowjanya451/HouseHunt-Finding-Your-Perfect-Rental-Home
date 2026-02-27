const Property = require('../models/Property');
const Owner = require('../models/Owner');

// Add Property (Owner only, must be approved)
const addProperty = async (req, res) => {
    try {
        const ownerId = req.user.id;

        // Check if owner is approved
        const owner = await Owner.findById(ownerId);
        if (!owner || !owner.isApproved) {
            return res.status(403).json({
                success: false,
                message: 'Your account is not approved yet. Please wait for admin approval.'
            });
        }

        const {
            title,
            description,
            location,
            rent,
            propertyType,
            bedrooms,
            bathrooms,
            amenities,
            images
        } = req.body;

        const property = await Property.create({
            title,
            description,
            location,
            rent,
            propertyType,
            bedrooms,
            bathrooms,
            amenities,
            images,
            ownerId
        });

        res.status(201).json({
            success: true,
            message: 'Property added successfully',
            data: property
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update Property
const updateProperty = async (req, res) => {
    try {
        const { id } = req.params;
        const ownerId = req.user.id;

        const property = await Property.findById(id);

        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found'
            });
        }

        // Check if the owner owns this property
        if (property.ownerId.toString() !== ownerId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this property'
            });
        }

        const updatedProperty = await Property.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Property updated successfully',
            data: updatedProperty
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete Property
const deleteProperty = async (req, res) => {
    try {
        const { id } = req.params;
        const ownerId = req.user.id;

        const property = await Property.findById(id);

        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found'
            });
        }

        // Check if the owner owns this property
        if (property.ownerId.toString() !== ownerId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this property'
            });
        }

        await Property.findByIdAndDelete(id);

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

// Get All Properties (Public - for renters to browse)
const getAllProperties = async (req, res) => {
    try {
        const {
            location,
            minRent,
            maxRent,
            propertyType,
            bedrooms,
            availability
        } = req.query;

        // Build filter object
        let filter = {};

        if (location) {
            filter.location = { $regex: location, $options: 'i' };
        }

        if (minRent || maxRent) {
            filter.rent = {};
            if (minRent) filter.rent.$gte = Number(minRent);
            if (maxRent) filter.rent.$lte = Number(maxRent);
        }

        if (propertyType) {
            filter.propertyType = propertyType;
        }

        if (bedrooms) {
            filter.bedrooms = Number(bedrooms);
        }

        if (availability !== undefined) {
            filter.availability = availability === 'true';
        }

        const properties = await Property.find(filter)
            .populate('ownerId', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: properties.length,
            data: properties
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Single Property by ID
const getSinglePropertyById = async (req, res) => {
    try {
        const { id } = req.params;

        const property = await Property.findById(id)
            .populate('ownerId', 'name email');

        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found'
            });
        }

        res.status(200).json({
            success: true,
            data: property
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Owner's Properties
const getOwnerProperties = async (req, res) => {
    try {
        const ownerId = req.user.id;

        const properties = await Property.find({ ownerId })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: properties.length,
            data: properties
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    addProperty,
    updateProperty,
    deleteProperty,
    getAllProperties,
    getSinglePropertyById,
    getOwnerProperties
};
