const User = require("../models/User");

// Show all user
const allUser = function (req, res) {
  User.getAll(function (err, users) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không truy xuất được dữ liệu",
      });
    } else {
      res.json(users);
    }
  });
};  

// Store new user
const store = function (req, res) {
  var newUser = new User(req.body);
  if (!newUser.username || !newUser.userusername || !newUser.userpassword || !newUser.usercic || !newUser.usergender || !newUser.useraddress || !newUser.userphone || !newUser.useremail || !newUser.userbanknumber || !newUser.wardid) {
    res.json({
      error: true,
      statusCode: 0,
      message: "Thông tin user không được để trống",
    });
  } else {
    User.store(newUser, function (err, user) {
      if (err) {
        res.json({
          error: true,
          statusCode: 0,
          message: "Lỗi! Thêm user không thành công",
        });
      } else {
        res.json({
          error: false,
          statusCode: 1,
          message: "Thêm user thành công",
        });
      }
    });
  }
};

// Get user by ID
const getUserByID = function (req, res) {
  var userID = req.params.id;
  User.getUserByID(userID, function (err, user) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy user",
      });
    } else {
      res.json(user);
    }
  })
}

// Store new user
const update = function (req, res) {
  var newUser = new User(req.body);
  var userID = req.params.id;
  if (!newUser.username || !newUser.userusername || !newUser.userpassword || !newUser.usercic || !newUser.usergender || !newUser.useraddress || !newUser.userphone || !newUser.useremail || !newUser.userbanknumber || !newUser.wardid) {
    res.json({
      error: true,
      statusCode: 0,
      message: "Thông tin user không được để trống",
    });
  } else {
    User.update(userID, newUser, function (err, user) {
      if (err) {
        res.json({
          error: true,
          statusCode: 0,
          message: "Lỗi! Cập nhật user không thành công",
        });
      } else {
        res.json({
          error: false,
          statusCode: 1,
          message: "Cập nhật user thành công",
        });
      }
    });
  }
};

module.exports = {
    allUser,
    getUserByID,
    store,
    update,
    // destroy,
}