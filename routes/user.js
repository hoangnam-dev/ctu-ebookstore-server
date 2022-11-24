const express = require("express");
const router = express.Router();
const { upload, uploadMultiple } = require("../utils/multer");

// Import Controller
const {
  allUser,
  checkUserNameIsset,
  getUserByID,
  search,
  store,
  update,
  changeAvatar,
  resetPassword,
  destroy,
  restore,
} = require("../app/controllers/UserController");

// Middlewares
const jwtMiddlewares = require('../app/middlewares/jwt');

router.get("/checkUsername/:userUsername", checkUserNameIsset);
router.get("/search", search);
router.get("/:id", getUserByID);
router.post("/", jwtMiddlewares.managerUser, upload.single("userAvatar"), store);
router.put("/:id", jwtMiddlewares.managerUser, update);
router.put("/changeAvatar/:id", jwtMiddlewares.managerUser, upload.single("userAvatar"), changeAvatar);
router.put("/resetPassword/:id", jwtMiddlewares.managerUser, resetPassword);
router.delete("/:id", jwtMiddlewares.managerUser, destroy);
router.put("/restore/:id", jwtMiddlewares.managerUser, restore);
router.get("/", jwtMiddlewares.managerUser, allUser);

module.exports = router;
