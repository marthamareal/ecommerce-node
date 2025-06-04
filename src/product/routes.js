const express = require("express");
const router = express.Router();
const { createProduct, getProducts, getProduct } = require("./controller");
const { protect, isAdminUser} = require("../auth/middleware");

// Register user
router.post("/", protect, isAdminUser, createProduct);
router.get("/", protect, getProducts);
router.get("/:id", protect, getProduct);

module.exports = router;
