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

// Register user
router.post("/", protect, isAdminUser, createProduct);
router.get("/", protect, getProducts);
router.get("/:id", protect, getProduct);
router.delete("/:id", protect, deleteProduct);
router.patch("/:id", protect, isAdminUser, updateProduct);

module.exports = router;
