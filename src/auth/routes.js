const express = require('express');
const { loginUser, refreshToken, forgotPassword, resetPassword, logoutUser } = require('./controller');
const router = express.Router();

// Login user
router.post("/login", loginUser);
router.post("/refresh", refreshToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/logout", logoutUser);

module.exports = router;
