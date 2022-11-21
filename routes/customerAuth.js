const express = require("express");
const router = express.Router();
const { upload } = require("../utils/multer");

// Import Controller
const {
  login,
  register,
  refreshAccessToken,
  logout,
} = require("../app/controllers/CustomerAuthController");

const {
  update,
  changeAvatar,
  changePassword,
} = require("../app/controllers/CustomerController");

// Middlewares
const jwtMiddlewares = require("../app/middlewares/jwt");

router.post("/login", login);
router.post("/register", register);
router.post("/refreshToken", refreshAccessToken);
router.post("/logout", jwtMiddlewares.verifyToken, logout);

router.put("/:id", jwtMiddlewares.verifyToken, update);
router.put("/changeAvatar/:id", jwtMiddlewares.verifyToken, upload.single("customerAvatar"), changeAvatar);
router.put("/changePassword/:id", jwtMiddlewares.verifyToken, changePassword);

module.exports = router;
