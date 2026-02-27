const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Renter = require('../models/Renter');
const Owner = require('../models/Owner');
const Admin = require('../models/Admin');

// Generate JWT Token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// Register Renter
const registerRenter = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if renter already exists
        const renterExists = await Renter.findOne({ email });
        if (renterExists) {
            return res.status(400).json({
                success: false,
                message: 'Renter already exists'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create renter
        const renter = await Renter.create({
            name,
            email,
            password: hashedPassword,
            role: 'renter'
        });

        res.status(201).json({
            success: true,
            message: 'Renter registered successfully',
            data: {
                id: renter._id,
                name: renter.name,
                email: renter.email,
                role: renter.role,
                token: generateToken(renter._id, renter.role)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Register Owner
const registerOwner = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if owner already exists
        const ownerExists = await Owner.findOne({ email });
        if (ownerExists) {
            return res.status(400).json({
                success: false,
                message: 'Owner already exists'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create owner (isApproved defaults to false)
        const owner = await Owner.create({
            name,
            email,
            password: hashedPassword,
            role: 'owner',
            isApproved: false
        });

        res.status(201).json({
            success: true,
            message: 'Owner registered successfully. Waiting for admin approval.',
            data: {
                id: owner._id,
                name: owner.name,
                email: owner.email,
                role: owner.role,
                isApproved: owner.isApproved,
                token: generateToken(owner._id, owner.role)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Register Admin
const registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if admin already exists
        const adminExists = await Admin.findOne({ email });
        if (adminExists) {
            return res.status(400).json({
                success: false,
                message: 'Admin already exists'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create admin
        const admin = await Admin.create({
            name,
            email,
            password: hashedPassword,
            role: 'admin'
        });

        res.status(201).json({
            success: true,
            message: 'Admin registered successfully',
            data: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                token: generateToken(admin._id, admin.role)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Login User (works for all roles)
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check in all user collections
        let user = await Renter.findOne({ email });
        let role = 'renter';

        if (!user) {
            user = await Owner.findOne({ email });
            role = 'owner';
        }

        if (!user) {
            user = await Admin.findOne({ email });
            role = 'admin';
        }

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Return user data with token
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isApproved: user.isApproved !== undefined ? user.isApproved : true,
                token: generateToken(user._id, user.role)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    registerRenter,
    registerOwner,
    registerAdmin,
    loginUser
};
