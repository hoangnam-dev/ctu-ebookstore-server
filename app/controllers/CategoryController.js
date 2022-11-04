const Category = require("../models/Category");

// Show all category
const allCategory = function (req, res) {
  Category.getAll(function (err, categories) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không truy xuất được dữ liệu",
      });
    } else {
      var categoryPre = categories.map((category) => {
        return {
          categoryID: category.categoryid,
          categoryName: category.categoryname,
          categoryDescription: category.categorydescription,
          directoryID: category.directoryid,
        };
      });
      res.json(categoryPre);
    }
  });
};

// Store new category
const store = function (req, res) {
  var newCategory = new Category(req.body);
  if (!newCategory.categoryname) {
    res.json({
      error: true,
      statusCode: 0,
      message: "Tên thể loại không được để trống",
    });
  } else {
    Category.store(newCategory, function (err, category) {
      if (err) {
        res.json({
          error: true,
          statusCode: 0,
          message: "Lỗi! Tạo thể loại không thành công",
        });
      } else {
        res.json({
          error: false,
          statusCode: 1,
          message: "Tạo thể loại thành công",
        });
      }
    });
  }
};

// Search categorys
const search = function (req, res) {
  var categoryName = req.query.name;
  Category.search(categoryName, function (err, categories) {
    if (err || Object.keys(categories).length === 0) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy thể loại",
      });
    } else {
      var categoryPre = categories.map((category) => {
        return {
          categoryID: category.categoryid,
          categoryName: category.categoryname,
          categoryDescription: category.categorydescription,
          directoryID: category.directoryid,
        };
      });
      res.json(categoryPre);
    }
  });
};

// Get category by directoryID
const getCategoryByDirectoryID = function (req, res) {
  var directoryID = req.body.directoryID;
  console.log("directoryID");
  Category.getCategoryByDirectoryID(directoryID, function (err, categories) {
    if (err || Object.keys(categories).length === 0) {
        res.json({
          error: true,
          statusCode: 0,
          message: "Lỗi! Không tìm thấy thể loại",
        });
      } else {
        var categoryPre = categories.map((category) => {
          return {
            categoryID: category.categoryid,
            categoryName: category.categoryname,
            categoryDescription: category.categorydescription,
            directoryID: category.directoryid,
          };
        });
        res.json(categoryPre);
      }
  });
};

// Get category by ID
const getCategoryByID = function (req, res) {
  var categoryID = req.params.id;
  Category.getCategoryByID(categoryID, function (err, category) {
    if (err || Object.keys(category).length === 0) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy thể loại",
      });
    } else {
      var categoryPre = category.map((category) => {
        return {
          categoryID: category.categoryid,
          categoryName: category.categoryname,
          categoryDescription: category.categorydescription,
          directoryID: category.directoryid,
        };
      });
      res.json(categoryPre);
    }
  });
};

// Store new category
const update = function (req, res) {
  var newCategory = new Category(req.body);
  var categoryID = req.params.id;
  if (!newCategory.categoryname || !newCategory.directoryid) {
    res.json({
      error: true,
      statusCode: 0,
      message: "Tên thể loại không được để trống",
    });
  } else {
    Category.update(categoryID, newCategory, function (err, category) {
      if (err) {
        res.json({
          error: true,
          statusCode: 0,
          message: "Lỗi! Cập nhật thể loại không thành công",
        });
      } else {
        res.json({
          error: false,
          statusCode: 1,
          message: "Cập nhật thể loại thành công",
        });
      }
    });
  }
};

// Restore category
const restore = function (req, res) {
  var categoryID = req.params.id;
  Category.getCategoryByID(categoryID, function (err, category) {
    if (err || Object.keys(category).length === 0) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy thể loại",
      });
    } else {
      Category.restore(categoryID, function (err, category) {
        if (err) {
          res.json({
            error: true,
            statusCode: 0,
            message: "Lỗi! Khôi phục thể loại không thành công",
          });
        } else {
          res.json({
            error: false,
            statusCode: 1,
            message: "Khôi phục thể loại thành công",
          });
        }
      });
    }
  });
};

// Delete category
const destroy = function (req, res) {
  var categoryID = req.params.id;
  Category.getCategoryByID(categoryID, function (err, category) {
    if (err || Object.keys(category).length === 0) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy thể loại",
      });
    } else {
      Category.delete(categoryID, function (err, category) {
        if (err) {
          res.json({
            error: true,
            statusCode: 0,
            message: "Lỗi! Xóa thể loại không thành công",
          });
        } else {
          res.json({
            error: false,
            statusCode: 1,
            message: "Xóa thể loại thành công",
          });
        }
      });
    }
  });
};

module.exports = {
  allCategory,
  getCategoryByID,
  getCategoryByDirectoryID,
  search,
  store,
  update,
  destroy,
  restore,
};
