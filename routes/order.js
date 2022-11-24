const express = require("express");
const router = express.Router();

// Import Controller
const {
  allOrder,
  getOrderByID,
  order,
  store,
  update,
  successPaypal,
  cancelPaypal,
  check,
} = require("../app/controllers/OrderController");

router.post("/check", check);
router.get("/order", order);
router.get("/successPaypal", successPaypal);
router.get("/cancelPaypal", cancelPaypal);
router.get("/:id", getOrderByID);
router.get("/", allOrder);
router.post("/order", order);
router.post("/", store);
router.put("/:id", update);

module.exports = router;
