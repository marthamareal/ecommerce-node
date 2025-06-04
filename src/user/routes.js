const express = require("express");
const router = express.Router();
const { createUser, updateUser, deleteUser, getUser, getUsers } = require("./controller");
const { protect } = require("../auth/middleware");
const { authorizeAccountOwmerOrAdmin, checkUserExists } = require("./middleware")

// Register user
router.post("/register", createUser);
router.get("/:id", protect, checkUserExists, getUser);
router.get("/", protect, getUsers);
router.patch("/:id", protect, authorizeAccountOwmerOrAdmin, checkUserExists, updateUser);
router.delete("/:id", protect, authorizeAccountOwmerOrAdmin, checkUserExists, deleteUser);

module.exports = router;
