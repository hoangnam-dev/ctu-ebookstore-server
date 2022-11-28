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
  addAuthor,
  addCategory,
  deleteAuthor,
  deleteCategory,
  destroy,
  restore,
} = require("../app/controllers/EbookController");

// Middlewares
const jwtMiddlewares = require('../app/middlewares/jwt');

router.get("/search", search);
router.get("/:id", getEbookByID);
router.post("/", jwtMiddlewares.managerEbook, uploadFileAndImages, store);

// Update ebook info (name, avatar, etc)
router.put("/:id", jwtMiddlewares.managerEbook, uploadFileAndImages, update);
// Update ebook content (epub or pdf)
router.put("/update-content/:id", jwtMiddlewares.managerEbook, uploadFileAndImages, updateEbookContent);

// Router change category and author of ebook
router.post("/add-author/:id", jwtMiddlewares.managerEbook, addAuthor);
router.post("/delete-author/:id", jwtMiddlewares.managerEbook, deleteAuthor);
router.post("/add-category/:id", jwtMiddlewares.managerEbook, addCategory);
router.post("/delete-category/:id", jwtMiddlewares.managerEbook, deleteCategory);

router.delete("/:id", jwtMiddlewares.managerEbook, destroy);
router.post("/restore/:id", jwtMiddlewares.managerEbook, restore);
router.get("/", allEbook);

module.exports = router;
