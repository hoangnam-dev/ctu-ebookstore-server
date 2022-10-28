const Author = require("../models/Author");

// Show all author
const allAuthor = function (req, res) {
  Author.getAll(function (err, authors) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không truy xuất được dữ liệu",
      });
    } else {
      res.json(authors);
    }
  });
};

// Store new author
const store = function (req, res) {
  var newAuthor = new Author(req.body);
  if (!newAuthor.authorname) {
    res.json({
      error: true,
      statusCode: 0,
      message: "Tên tác giả không được để trống",
    });
  } else {
    Author.store(newAuthor, function (err, author) {
      if (err) {
        res.json({
          error: true,
          statusCode: 0,
          message: "Lỗi! Thêm tác giả không thành công",
        });
      } else {
        res.json({
          error: false,
          statusCode: 1,
          message: "Thêm tác giả thành công",
        });
      }
    });
  }
};

// Get author by ID
const getAuthorByID = function (req, res) {
  var authorID = req.params.id;
  Author.getAuthorByID(authorID, function (err, author) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy tác giả",
      });
    } else {
      res.json(author);
    }
  })
}

// Store new author
const update = function (req, res) {
  var newAuthor = new Author(req.body);
  var authorID = req.params.id;
  if (!newAuthor.authorname) {
    res.json({
      error: true,
      statusCode: 0,
      message: "Tên tác giả không được để trống",
    });
  } else {
    Author.update(authorID, newAuthor, function (err, author) {
      if (err) {
        res.json({
          error: true,
          statusCode: 0,
          message: "Lỗi! Cập nhật tác giả không thành công",
        });
      } else {
        res.json({
          error: false,
          statusCode: 1,
          message: "Cập nhật tác giả thành công",
        });
      }
    });
  }
};

module.exports = {
    allAuthor,
    getAuthorByID,
    store,
    update,
    // destroy,
}