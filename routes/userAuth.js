const express = require("express");
const router = express.Router();
const { upload } = require("../utils/multer");

// Import Controller
const {
  login,
  refreshAccessToken,
  logout,
} = require("../app/controllers/UserAuthController");

const {
  update,
  changeAvatar,
  changePassword,
} = require("../app/controllers/UserController");

// Middlewares
const jwtMiddlewares = require("../app/middlewares/jwt");

router.post("/login", login);
router.post("/refreshToken", refreshAccessToken);
router.post("/logout", jwtMiddlewares.verifyToken, logout);

router.put("/:id", update);
router.put("/changeAvatar/:id", upload.single("userAvatar"), changeAvatar);
router.put("/changePassword/:id", changePassword);

module.exports = router;
