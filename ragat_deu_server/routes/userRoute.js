const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Multer for Profile Pictures
const profileUploadDir = path.join(__dirname, '..', 'uploads', 'profiles');
if (!fs.existsSync(profileUploadDir)) {
    fs.mkdirSync(profileUploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, profileUploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const uploadProfile = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
});

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
    resetPassword,
    verify2FA,
    toggle2FA,
    googleLogin
} = require("../controller/userController");

const { authorizeToken, requireAdmin } = require("../middleware/authMiddleware");

// Import the new security middlewares
const { authLimiter, loginLimiter, otpLimiter } = require('../middleware/rateLimiter');
const verifyRecaptcha = require('../middleware/recaptcha');


// ## 2. Define Public Routes with Security Layers ##

// User registration with rate limiting and reCAPTCHA
router.post('/register', [authLimiter], registerUser);

// User login with rate limiting and reCAPTCHA
router.post("/login", [loginLimiter], loginUser);

// 2FA Verification (Protected by strict rate limit)
router.post("/verify-2fa", [otpLimiter], verify2FA);


// ## 3. Define Protected User Routes ##
// Toggle 2FA
router.put("/toggle-2fa", [authLimiter, authorizeToken], toggle2FA);

router.use(authorizeToken); // Apply auth middleware to all routes below

// Get personal profile information
router.get('/me', authorizeToken, getMe);

// Update personal profile information
router.put('/me', authorizeToken, uploadProfile.single('profilePicture'), updateMe);

// Password Management (Secure)
router.post("/change-password", authorizeToken, changePassword);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:resetToken", resetPassword);

// Social Login
router.post('/social-login', socialLogin);
router.post('/google-login', [loginLimiter], googleLogin);

// Donor: see all approved users
router.get('/approved', authorizeToken, getApprovedUser);


// ## 4. Define Admin-Only Routes ##

// Admin: approve a user
router.put('/:id/approve', authorizeToken, requireAdmin, approveUser);

// Admin: delete a user
router.delete('/:id', authorizeToken, requireAdmin, deleteUser);


module.exports = router;