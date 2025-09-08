const express = require("express");
const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller");

const {authMiddleware , adminPage} = require("../middleware/auth.middleware")

const router = express.Router();

router.get("/users", authMiddleware, adminPage ,  getAllUsers);
router.get(`/users/:id`, authMiddleware , adminPage , getUser);
router.put(`/users/:id`, authMiddleware, adminPage ,updateUser);
router.delete(`/users/:id`, authMiddleware, adminPage, deleteUser);

module.exports = router;
