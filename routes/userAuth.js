const express = require("express");
const router = express.Router();

// Import Controller
const {
  login,
  refreshAccessToken,
  logout,
} = require("../app/controllers/UserAuthController");

// Middlewares
const { verifyToken } = require("../app/middlewares/jwt");

router.post("/login", login);
router.post("/refreshToken", refreshAccessToken);
router.post("/logout", verifyToken, logout);

module.exports = router;
