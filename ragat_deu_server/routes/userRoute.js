const express = require("express");
const router = express.Router();

// ## 1. Import Controllers and All Middlewares ##
const {
    registerUser,
    loginUser,
    getApprovedUser,
    approveUser,
    deleteUser,
    getMe,
    updateMe,
    changePassword,
    socialLogin, // Ensure socialLogin is exported from your controller
    forgotPassword,
    resetPassword
} = require("../controller/userController");

const { authorizeToken, requireAdmin } = require("../middleware/authMiddleware");

// Import the new security middlewares
const authLimiter = require('../middleware/rateLimiter');
const verifyRecaptcha = require('../middleware/recaptcha');


// ## 2. Define Public Routes with Security Layers ##

// User registration with rate limiting and reCAPTCHA
router.post('/register', [authLimiter], registerUser);

// User login with rate limiting and reCAPTCHA
router.post("/login", [authLimiter], loginUser);


// ## 3. Define Protected User Routes ##

// Get personal profile information
router.get('/me', authorizeToken, getMe);

// Update personal profile information
router.put('/me', authorizeToken, updateMe);

// Password Management (Secure)
router.post("/change-password", authorizeToken, changePassword);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:resetToken", resetPassword);

// Social Login
router.post('/social-login', socialLogin);

// Donor: see all approved users
router.get('/approved', authorizeToken, getApprovedUser);


// ## 4. Define Admin-Only Routes ##

// Admin: approve a user
router.put('/:id/approve', authorizeToken, requireAdmin, approveUser);

// Admin: delete a user
router.delete('/:id', authorizeToken, requireAdmin, deleteUser);


module.exports = router;