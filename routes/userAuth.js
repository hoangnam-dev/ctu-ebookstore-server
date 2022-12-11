const express = require("express");
const router = express.Router();
const { upload } = require("../utils/multer");

// Import Controller
const {
  login,
  refreshAccessToken,
  logout,
  profile,
  updateProfile,
  changeAvatar,
  changePassword,
} = require("../app/controllers/UserAuthController");

// Middlewares
const jwtMiddlewares = require("../app/middlewares/jwt");

router.post("/login", login);
router.post("/refreshToken", refreshAccessToken);
router.post("/profile", jwtMiddlewares.verifyToken, profile);
router.post("/logout", jwtMiddlewares.verifyToken, logout);

router.put("/:id", jwtMiddlewares.verifyToken, updateProfile);
router.put("/changeAvatar/:id", jwtMiddlewares.verifyToken, upload.single("userAvatar"), changeAvatar);
router.put("/changePassword/:id", jwtMiddlewares.verifyToken, changePassword);

module.exports = router;
