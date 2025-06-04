const express = require("express");
const router = express.Router();
const { createProduct } = require("./controller");
const { protect, isAdminUser} = require("../auth/middleware");

// Register user
router.post("/", protect, isAdminUser, createProduct);

module.exports = router;
