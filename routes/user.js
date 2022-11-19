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
  changePassword,
  resetPassword,
  destroy,
  restore,
} = require("../app/controllers/UserController");

// Middlewares
const { verifyToken } = require("../app/middlewares/jwt");

router.get("/checkUsername/:userUsername", checkUserNameIsset);
router.get("/search", search);
router.get("/:id", getUserByID);
router.post("/", upload.single("userAvatar"), store);
router.put("/:id", update);
router.put("/changeAvatar/:id", upload.single("userAvatar"), changeAvatar);
router.put("/changePassword/:id", changePassword);
router.put("/resetPassword/:id", resetPassword);
router.delete("/:id", destroy);
router.put("/restore/:id", restore);
router.get("/", verifyToken, allUser);

module.exports = router;
