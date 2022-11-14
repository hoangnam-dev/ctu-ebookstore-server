const express = require("express");
const router = express.Router();
const { upload, uploadFileAndImages } = require('../utils/multer');


// Import Controller
const {
  allEbook,
  getEbookByID,
  search,
  store,
  update,
  updateEbookContent,
  addImage,
  deleteImage,
  destroy,
  restore,
} = require("../app/controllers/EbookController");

router.get("/search", search);
router.get("/:id", getEbookByID);
router.post("/", uploadFileAndImages, store);
router.put("/update-content/:id", uploadFileAndImages, updateEbookContent);
router.put("/:id", uploadFileAndImages, update);
router.post("/add-image", uploadFileAndImages, addImage);
router.post("/delete-image", deleteImage);
router.post("/restore/:id", restore);
router.delete("/:id", destroy);
router.get("/", allEbook);

module.exports = router;
