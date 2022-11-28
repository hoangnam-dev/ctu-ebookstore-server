const express = require("express");
const { add } = require("lodash");
const router = express.Router();

// Import Controller
const {
  allSale,
  getSaleByID,
  store,
  update,
  destroy,
  search,
  addDetail,
  deleteDetail,
} = require("../app/controllers/SaleController");

// Middlewares
const jwtMiddlewares = require("../app/middlewares/jwt");

router.get("/search", search);
router.get("/:id", getSaleByID);
router.get("/", allSale);
router.post("/", jwtMiddlewares.managerSale, store);
router.put("/:id", jwtMiddlewares.managerSale, update);
router.delete("/:id", jwtMiddlewares.managerSale, destroy);
// sale detail
router.post("/addDetail", jwtMiddlewares.managerSale, addDetail);
router.post("/deleteDetail", jwtMiddlewares.managerSale, deleteDetail);

module.exports = router;
