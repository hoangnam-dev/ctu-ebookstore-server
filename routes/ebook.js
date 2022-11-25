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

// Middlewares
const jwtMiddlewares = require('../app/middlewares/jwt');

router.get("/search", search);
router.get("/:id", getEbookByID);
router.post("/", jwtMiddlewares.managerEbook, uploadFileAndImages, store);

// Update ebook content (epub or pdf)
router.put("/update-content/:id", jwtMiddlewares.managerEbook, uploadFileAndImages, updateEbookContent);
// Update ebook info (name, avatar, etc)
router.put("/:id", jwtMiddlewares.managerEbook, uploadFileAndImages, update);

router.post("/add-image", jwtMiddlewares.managerEbook, uploadFileAndImages, addImage);
router.post("/delete-image", jwtMiddlewares.managerEbook, deleteImage);
router.post("/restore/:id", jwtMiddlewares.managerEbook, restore);
router.delete("/:id", jwtMiddlewares.managerEbook, destroy);
router.get("/", allEbook);

module.exports = router;
