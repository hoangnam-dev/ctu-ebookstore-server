const express = require("express");
const router = express.Router();
const { upload, uploadMultiple } = require("../utils/multer");

// Import Controller
const {
  allCustomer,
  getCustomerByID,
  store,
  search,
  update,
  changeAvatar,
  changePassword,
  resetPassword,
  destroy,
  restore,
} = require("../app/controllers/CustomerController");
const jwtMiddlewares = require('../app/middlewares/jwt');

router.get("/:id", getCustomerByID);
router.get("/search", search);
router.get("/", allCustomer);
router.post("/", jwtMiddlewares.managerCustomer, upload.single("customerAvatar"), store);
router.put("/:id", jwtMiddlewares.managerCustomer, update);
router.put("/resetPassword/:id", jwtMiddlewares.managerCustomer, resetPassword);
router.put("/changeAvatar/:id", upload.single("customerAvatar"), changeAvatar);
router.put("/changePassword/:id", changePassword);
router.delete("/:id", jwtMiddlewares.managerCustomer, destroy);
router.put("/restore/:id", jwtMiddlewares.managerCustomer, restore);

module.exports = router;
