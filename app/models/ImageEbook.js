const db = require("../../config/db");

// Constructor
const ImageEbook = function (imageebook) {
  this.imageebookid = imageebook.imageebookID;
  this.imageebooksource = imageebook.imageebookSource;
  this.ebookid = imageebook.ebookID;
};

// Get all imageebook
ImageEbook.getAll = function getAllImageEbook(result) {
  db.query("SELECT * FROM imageebook", function (err, res) {
    if (err) {
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

// Get imageebook by ID
ImageEbook.getImageEbookByID = function getImageEbookByID(imageebookID, result) {
  db.query(
    "SELECT * FROM imageebook WHERE imageebookid = ?",
    imageebookID,
    function (err, res) {
      if (err) {
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};

// Store imageebook
ImageEbook.store = function storeEbookImages(ebookID, images, result) {
  var values = [];
  images.forEach((image) => {
    values.push([ebookID, image]);
  });
  const sql = "INSERT INTO imageebook (ebookid, imageebooksource) VALUES ?";
  db.query(sql, [values], function (err, res) {
    if (err) {
      result(err, null);
    } else {
      result(null, res.insertId);
    }
  });
};

// Update imageebook
ImageEbook.update = function updateImageEbook(imageebook, result) {
  db.query(
    "UPDATE imageebook SET imageebooksource = ?, ebookid = ? WHERE imageebookid = ?",
    [
      imageebook.imageebooksource,
      imageebook.ebookid,
      imageebook.imageebookid
    ],
    function (err, res) {
      if (err) {
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};

// Delete imageebook
ImageEbook.delete = function deleteImageEbook(imageEbookID, ebookID, result) {
  db.query(
    "DELETE FROM imageebook WHERE imageebookid = ? AND ebookid = ?",
    [imageEbookID, ebookID],
    function (err, res) {
      if (err) {
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};

module.exports = ImageEbook;
