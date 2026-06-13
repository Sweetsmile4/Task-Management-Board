const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getCurrentUser,
} = require("../controllers/authController");

router.get("/me", protect, getCurrentUser);


router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;