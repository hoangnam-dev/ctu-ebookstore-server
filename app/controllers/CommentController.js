const Comment = require("../models/Comment");

// Show all comment
const allComment = function (req, res) {
  Comment.getAll(function (err, comments) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không truy xuất được dữ liệu",
      });
    } else {
      res.json(comments);
    }
  });
};

// Store new comment
const store = function (req, res) {
  var newComment = new Comment(req.body);
  if (!newComment.commentcontent || !newComment.commentrate) {
    res.json({
      error: true,
      statusCode: 0,
      message: "Thông tin bình luận không được để trống",
    });
  } else {
    Comment.store(newComment, function (err, comment) {
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

// Get comment by ID
const getCommentByID = function (req, res) {
  var commentID = req.params.id;
  Comment.getCommentByID(commentID, function (err, comment) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy tác giả",
      });
    } else {
      res.json(comment);
    }
  })
}

// Store new comment
const update = function (req, res) {
  var newComment = new Comment(req.body);
  var commentID = req.params.id;
  if (!newComment.commentcontent || !newComment.commentrate) {
    res.json({
      error: true,
      statusCode: 0,
      message: "Thông tin bình luận không được để trống",
    });
  } else {
    Comment.update(commentID, newComment, function (err, comment) {
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
    allComment,
    getCommentByID,
    store,
    update,
    // destroy,
}