const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
  addToCart,
  getCart,
} = require("./controller");
const { protect, isAdminUser } = require("../auth/middleware");
const checkProductExists = require("./middleware")

// Product
router.post("/", protect, isAdminUser, createProduct);
router.get("/", protect, getProducts);
router.get("/:id", protect, checkProductExists, getProduct);
router.delete("/:id", protect, checkProductExists, deleteProduct);
router.patch("/:id", protect, isAdminUser, checkProductExists, updateProduct);

// Cart
router.post("/cart/add", protect, addToCart);
router.get("/cart/items", protect, getCart);

module.exports = router;
