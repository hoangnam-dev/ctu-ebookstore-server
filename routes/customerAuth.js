const express = require("express");
const router = express.Router();
const { upload, uploadFileAndImages } = require("../utils/multer");

// Import Controller
const {
  login,
  register,
  refreshAccessToken,
  logout,
  profile,
  updateProfile,
  changeAvatar,
  changePassword,
} = require("../app/controllers/CustomerAuthController");

// Middlewares
const jwtMiddlewares = require("../app/middlewares/jwt");

router.post("/login", login);
router.post("/register", upload.single("customerAvatar"), register);
router.post("/refreshToken", jwtMiddlewares.verifyToken, refreshAccessToken);
router.post("/logout", jwtMiddlewares.verifyToken, logout);

router.post("/profile", jwtMiddlewares.verifyToken, profile);
router.put("/:id", jwtMiddlewares.verifyToken, updateProfile);
router.put("/changeAvatar/:id", jwtMiddlewares.verifyToken, upload.single("customerAvatar"), changeAvatar);
router.put("/changePassword/:id", jwtMiddlewares.verifyToken, changePassword);

module.exports = router;
