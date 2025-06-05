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
  removeFromCart,
  createOrder,
  getOrder,
  getOrders,
  updateOrderStatus,
} = require("./controller");
const { validateIdParam } = require("../middleware")
const { protect, isAdminUser } = require("../auth/middleware");
const { checkProductExists, checkOrderExists } = require("./middleware")

// Product
router.post("/", protect, isAdminUser, createProduct);
router.get("/", protect, getProducts);
router.get("/:id", protect, validateIdParam, checkProductExists, getProduct);
router.delete("/:id", protect, validateIdParam, checkProductExists, deleteProduct);
router.patch("/:id", protect, isAdminUser, validateIdParam, checkProductExists, updateProduct);

// Cart
router.post("/cart/add", protect, addToCart);
router.get("/cart/items", protect, getCart);
router.delete("/cart/items/remove", protect, removeFromCart);

// Order
router.post("/orders/create", protect, createOrder);
router.get("/orders/retrieve", protect, getOrders);
router.get("/orders/:id", protect, validateIdParam, checkOrderExists, getOrder);
router.patch("/orders/:id", protect, validateIdParam, checkOrderExists, updateOrderStatus);

module.exports = router;
