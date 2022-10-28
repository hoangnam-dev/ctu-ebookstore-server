const Directory = require("../models/Directory");

// Show all directory
const allDirectory = function (req, res) {
  Directory.getAll(function (err, directories) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không truy xuất được dữ liệu",
      });
    } else {
      res.json(directories);
    }
  });
};

// Store new directory
const store = function (req, res) {
  var newDirectory = new Directory(req.body);
  if (!newDirectory.directoryname) {
    res.json({
      error: true,
      statusCode:0,
      message: "Tên tác giả không được để trống",
    });
  } else {
    Directory.store(newDirectory, function (err, directory) {
      if (err) {
        res.json({
          error: true,
          statusCode: 0,
          message: "Lỗi! Tạo danh mục không thành công",
        });
      } else {
        res.json({
          error: false,
          statusCode: 1,
          message: "Tạo danh mục thành công",
        });
      }
    });
  }
};

// Get directory by ID
const getDirectoryByID = function (req, res) {
  var directoryID = req.params.id;
  Directory.getDirectoryByID(directoryID, function (err, directory) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy danh mục",
      });
    } else {
      res.json(directory);
    }
  })
}

// Store new directory
const update = function (req, res) {
  var newDirectory = new Directory(req.body);
  var directoryID = req.params.id;
  if (!newDirectory.directoryname) {
    res.json({
      error: true,
      statusCode: 0,
      message: "Tên danh mục không được để trống",
    });
  } else {
    Directory.update(directoryID, newDirectory, function (err, directory) {
      if (err) {
        res.json({
          error: true,
          statusCode: 0,
          message: "Lỗi! Cập nhật danh mục không thành công",
        });
      } else {
        res.json({
          error: false,
          statusCode: 1,
          message: "Cập nhật danh mục thành công",
        });
      }
    });
  }
};

module.exports = {
    allDirectory,
    getDirectoryByID,
    store,
    update,
    // destroy,
}