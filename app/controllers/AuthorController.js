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
      var authorPre = authors.map((author) => {
        return {
          authorID: author.authorid,
          authorName: author.authorname,
          authorStory: author.authorstory,
          authorGender: author.authorgender,
          authorBirthdate: author.authorbirthdate,
        };
      });
      res.json(authorPre);
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

// Search authors
const search = function (req, res) {
  var authorName = req.query.name;
  console.log(authorName);
  Author.search(authorName, function (err, author) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy tác giả",
      });
    } else {
      var authorPre = author.map((author) => {
        return {
          authorID: author.authorid,
          authorName: author.authorname,
          authorStory: author.authorstory,
          authorGender: author.authorgender,
          authorBirthdate: author.authorbirthdate,
        };
      });
      res.json(authorPre);
    }
  });
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
      var authorPre = author.map((author) => {
        return {
          authorID: author.authorid,
          authorName: author.authorname,
          authorStory: author.authorstory,
          authorGender: author.authorgender,
          authorBirthdate: author.authorbirthdate,
        };
      });
      res.json(authorPre);
    }
  });
};

// Delete author
const destroy = function (req, res) {
  var authorID = req.params.id;
  Author.getAuthorByID(authorID, function (err, author) {
    if (err || Object.keys(res).length === 0) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy tác giả",
      });
    } else {
      Author.delete(authorID, function (err, author) {
        if (err) {
          res.json({
            error: true,
            statusCode: 0,
            message: "Lỗi! Xóa tác giả không thành công",
          });
        } else {
          res.json({
            error: false,
            statusCode: 1,
            message: "Xóa tác giả thành công",
          });
        }
      });
    }
  });
};

// Store new author
const update = function (req, res) {
  var newAuthor = new Author(req.body);
  if (!newAuthor.authorname) {
    res.json({
      error: true,
      statusCode: 0,
      message: "Tên tác giả không được để trống",
    });
  } else {
    Author.update(newAuthor, function (err, author) {
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
  search,
  store,
  update,
  destroy,
};
