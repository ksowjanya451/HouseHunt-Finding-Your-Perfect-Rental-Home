// Role-based middleware functions

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Access denied. Admin only.'
        });
    }
};

const isOwner = (req, res, next) => {
    if (req.user && req.user.role === 'owner') {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Access denied. Owner only.'
        });
    }
};

const isRenter = (req, res, next) => {
    if (req.user && req.user.role === 'renter') {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Access denied. Renter only.'
        });
    }
};

module.exports = { isAdmin, isOwner, isRenter };
