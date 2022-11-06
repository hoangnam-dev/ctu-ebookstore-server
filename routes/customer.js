const express = require("express");
const router = express.Router();

// Import Controller
const {
  allCustomer,
  getCustomerByID,
  store,
  search,
  update,
  destroy,
  restore,
} = require("../app/controllers/CustomerController");

router.get("/search", search);
router.post("/", store);
router.get("/:id", getCustomerByID);
router.put("/:id", update);
router.delete("/:id", destroy);
router.put("/restore/:id", restore);
router.get("/", allCustomer);

module.exports = router;
