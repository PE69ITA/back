const express = require("express");
const {
  register,
  login,
  getMe,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ message: "Auth route works" });
});

router.post("/register", register);

router.post("/login", login);

router.get("/me", authMiddleware, getMe);

module.exports = router;