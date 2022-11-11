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
  destroy,
  restore,
} = require("../app/controllers/CustomerController");

router.get("/:id", getCustomerByID);
router.get("/search", search);
router.get("/", allCustomer);
router.post("/", upload.single("customerAvatar"), store);
router.put("/:id", update);
router.put("/changeAvatar/:id", upload.single("customerAvatar"), changeAvatar);
router.put("/changePassword/:id", changePassword);
router.delete("/:id", destroy);
router.put("/restore/:id", restore);

module.exports = router;
