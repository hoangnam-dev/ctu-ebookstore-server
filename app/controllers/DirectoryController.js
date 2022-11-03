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
      var directoryPre = directories.map((directory) => {
        return {
          directoryID: directory.directoryid,
          directoryName: directory.directoryname,
          directoryDescription: directory.directorydescription,
        };
      });
      res.json(directoryPre);
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
      message: "Tên danh mục không được để trống",
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

// Search directorys
const search = function (req, res) {
  var directoryName = req.query.name;
  console.log(directoryName);
  Directory.search(directoryName, function (err, directory) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy danh mục",
      });
    } else {
      var directoryPre = directory.map((directory) => {
        return {
          directoryID: directory.directoryid,
          directoryName: directory.directoryname,
          directoryDescription: directory.directorydescription,
        };
      });
      res.json(directoryPre);
    }
  });
};

// Get directory by ID
const getDirectoryByID = function (req, res) {
  var directoryID = req.params.id;
  Directory.getDirectoryByID(directoryID, function (err, directory) {
    if (err || Object.keys(directory).length === 0) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy danh mục",
      });
    } else {
      var directoryPre = directory.map((directory) => {
        return {
          directoryID: directory.directoryid,
          directoryName: directory.directoryname,
          directoryDescription: directory.directorydescription,
        };
      });
      res.json(directoryPre);
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

// Restore directory
const restore = function (req, res) {
  var directoryID = req.params.id;
  Directory.getDirectoryByID(directoryID, function (err, directory) {
    if (err || Object.keys(directory).length === 0) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy danh mục",
      });
    } else {
      Directory.restore(directoryID, function (err, directory) {
        if (err) {
          res.json({
            error: true,
            statusCode: 0,
            message: "Lỗi! Khôi phục danh mục không thành công",
          });
        } else {
          res.json({
            error: false,
            statusCode: 1,
            message: "Khôi phục danh mục thành công",
          });
        }
      });
    }
  });
};

// Delete directory
const destroy = function (req, res) {
  var directoryID = req.params.id;
  Directory.getDirectoryByID(directoryID, function (err, directory) {
    if (err || Object.keys(directory).length === 0) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy danh mục",
      });
    } else {
      Directory.delete(directoryID, function (err, directory) {
        if (err) {
          res.json({
            error: true,
            statusCode: 0,
            message: "Lỗi! Xóa danh mục không thành công",
          });
        } else {
          res.json({
            error: false,
            statusCode: 1,
            message: "Xóa danh mục thành công",
          });
        }
      });
    }
  });
};

module.exports = {
    allDirectory,
    getDirectoryByID,
    search,
    store,
    update,
    destroy,
    restore,
}