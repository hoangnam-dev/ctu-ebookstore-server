const express = require("express");
const router = express.Router();
const { upload } = require("../utils/multer");

// Import Controller
const {
  update,
  changeAvatar,
  changePassword,
} = require("../app/controllers/UserController");

// Middlewares
const jwtMiddlewares = require('../app/middlewares/jwt');

router.put("/:id", update);
router.put("/changeAvatar/:id", upload.single("userAvatar"), changeAvatar);
router.put("/changePassword/:id", changePassword);

module.exports = router;
