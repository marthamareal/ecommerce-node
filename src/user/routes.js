const express = require("express");
const router = express.Router();
const { createUser } = require("./controller");

// Register user
router.post("/register", createUser);

module.exports = router;
