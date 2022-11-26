const express = require("express");
const router = express.Router();

// Import Controller
const {
  allOrder,
  getOrderByID,
  order,
  successPaypal,
  cancelPaypal,
  update
} = require("../app/controllers/OrderController");

const jwtMiddlewares = require('../app/middlewares/jwt');

// router.get("/order", order); // test
// Completed Order
router.get("/successPaypal", successPaypal);
// Cancel Order
router.get("/cancelPaypal", cancelPaypal);
// Get Order Details
router.get("/:id", getOrderByID);
// Get All Order
router.get("/", allOrder);
// Update Order(Admin using)
router.put("/:id", jwtMiddlewares.managerOrder, update);
// Order with Paypal
router.post("/order", order);


module.exports = router;
