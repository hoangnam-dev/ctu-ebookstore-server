const express = require("express");
const router = express.Router();

// Import Controller
const {
  login,
  refreshAccessToken,
  logout,
} = require("../app/controllers/UserAuthController");

// Middlewares
const jwtMiddlewares = require("../app/middlewares/jwt");

router.post("/login", login);
router.post("/refreshToken", refreshAccessToken);
router.post("/logout", jwtMiddlewares.verifyToken, logout);

module.exports = router;
