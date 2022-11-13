const express = require("express");
const router = express.Router();
const { upload, uploadMultiple, uploadAvatarAndImages } = require('../utils/multer');


// Import Controller
const {
  allEbook,
  getEbookByID,
  search,
  store,
  update,
  destroy,
  restore,
} = require("../app/controllers/EbookController");

router.get("/search", search);
router.get("/:id", getEbookByID);
router.post("/", uploadAvatarAndImages, store);
router.put("/:id", update);
router.delete("/:id", destroy);
router.post("/restore/:id", restore);
router.get("/", allEbook);

module.exports = router;
