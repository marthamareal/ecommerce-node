const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct
} = require("./controller");
const { protect, isAdminUser } = require("../auth/middleware");
const checkProductExists = require("./middleware")

// Register user
router.post("/", protect, isAdminUser, createProduct);
router.get("/", protect, getProducts);
router.get("/:id", protect, checkProductExists, getProduct);
router.delete("/:id", protect, checkProductExists, deleteProduct);
router.patch("/:id", protect, isAdminUser, checkProductExists, updateProduct);

module.exports = router;
