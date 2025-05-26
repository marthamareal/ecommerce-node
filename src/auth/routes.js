const express = require('express');
const { loginUser } = require('./controller');
const router = express.Router();

// Login user
router.post("/login", loginUser);
// router.post("/refresh", getRefreshToken);
// router.post("/forgot", forgotPassword);
// router.post("/reset", resetPassword);
// router.post("/logout", logoutUser);

module.exports = router;
