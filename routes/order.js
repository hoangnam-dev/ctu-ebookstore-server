const express = require("express");
const router = express.Router();

// Import Controller
const {
  allOrder,
  getOrderByID,
  order,
  successPaypal,
  cancelPaypal,
} = require("../app/controllers/OrderController");

// router.get("/order", order); // test
// Completed Order
router.get("/successPaypal", successPaypal);
// Cancel Order
router.get("/cancelPaypal", cancelPaypal);
// Get Order Details
router.get("/:id", getOrderByID);
// Get All Order
router.get("/", allOrder);
// Order with Paypal
router.post("/order", order);

module.exports = router;
