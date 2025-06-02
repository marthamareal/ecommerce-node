const express = require("express");
const router = express.Router();
const { createUser, updateUser, deleteUser, getUser, getUsers } = require("./controller");
const protect = require("../auth/middleware");
const authorizeAccountOwmerOrAdmin = require("./middleware")

// Register user
router.post("/register", createUser);
router.get("/:id", protect, getUser);
router.get("/", protect, getUsers);
router.patch("/:id", protect, authorizeAccountOwmerOrAdmin, updateUser);
router.delete("/:id", protect, authorizeAccountOwmerOrAdmin, deleteUser);

module.exports = router;
