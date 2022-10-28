const Ebook = require("../models/Ebook");

// Show all ebook
const allEbook = function (req, res) {
  Ebook.getAll(function (err, ebooks) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không truy xuất được dữ liệu",
      });
    } else {
      res.json(ebooks);
    }
  });
};

// Store new ebook
const store = function (req, res) {
  var newEbook = new Ebook(req.body);
  if (!newEbook.ebookname || !newEbook.ebookprice || !newEbook.ebookstatus) {
    res.json({
      error: true,
      statusCode: 0,
      message: "Thông tin ebook không được để trống",
    });
  } else {
    Ebook.store(newEbook, function (err, ebook) {
      if (err) {
        res.json({
          error: true,
          statusCode: 0,
          message: "Lỗi! Thêm ebook không thành công",
        });
      } else {
        res.json({
          error: false,
          statusCode: 1,
          message: "Thêm ebook thành công",
        });
      }
    });
  }
};

// Get ebook by ID
const getEbookByID = function (req, res) {
  var ebookID = req.params.id;
  Ebook.getEbookByID(ebookID, function (err, ebook) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy ebook",
      });
    } else {
      res.json(ebook);
    }
  })
}

// Store new ebook
const update = function (req, res) {
  var newEbook = new Ebook(req.body);
  var ebookID = req.params.id;
  if (!newEbook.ebookname || !newEbook.ebookprice || !newEbook.ebookstatus) {
    res.json({
      error: true,
      statusCode: 0,
      message: "Thông tin ebook không được để trống",
    });
  } else {
    Ebook.update(ebookID, newEbook, function (err, ebook) {
      if (err) {
        res.json({
          error: true,
          statusCode: 0,
          message: "Lỗi! Cập nhật ebook không thành công",
        });
      } else {
        res.json({
          error: false,
          statusCode: 1,
          message: "Cập nhật ebook thành công",
        });
      }
    });
  }
};

module.exports = {
    allEbook,
    getEbookByID,
    store,
    update,
    // destroy,
}