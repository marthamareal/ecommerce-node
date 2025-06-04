const express = require("express");
const router = express.Router();
const { createProduct, getProducts } = require("./controller");
const { protect, isAdminUser} = require("../auth/middleware");

// Register user
router.post("/", protect, isAdminUser, createProduct);
router.get("/", protect, getProducts);

module.exports = router;
