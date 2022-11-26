const express = require("express");
const router = express.Router();

// Import Controller
const {
  getNewEbook,
  getBestsellerEbook,
} = require("../app/controllers/DashboardController");

router.get("/", getNewEbook);
router.get("/bestseller-ebook", getBestsellerEbook);

module.exports = router;
