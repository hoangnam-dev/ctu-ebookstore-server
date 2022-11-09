const { express } = require('express');
const User = require("../models/User");
const { cloudinary } = require("../../utils/cloudinary");
const bcrypt = require('bcrypt');
const saltRounds = 10;

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
const store = async function (req, res) {
  var newUser = new User(req.body);
  if (
    !newUser.username ||
    !newUser.userusername ||
    !newUser.userpassword ||
    !newUser.usercic ||
    !newUser.usergender ||
    !newUser.useraddress ||
    !newUser.userphone ||
    !newUser.useremail ||
    !newUser.userbanknumber ||
    !newUser.wardid
  ) {
    res.json({
      error: true,
      statusCode: 0,
      message: "Thông tin user không được để trống",
    });
  } else {
    bcrypt.hash(req.body.userPassword, saltRounds, function(err, hash) {
      newUser.userpassword = hash;
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
  });    

    // const fileStr = req.body.data;
    // const uploadResponse = await cloudinary.uploader.upload(fileStr, {
    //     upload_preset: 'ebookstore_user',
    // });
    // if(uploadResponse.url) {
      // newUser.useravatar = uploadResponse.url;
      // User.store(newUser, function (err, user) {
      //   if (err) {
      //     res.json({
      //       error: true,
      //       statusCode: 0,
      //       message: "Lỗi! Thêm user không thành công",
      //     });
      //   } else {
      //     res.json({
      //       error: false,
      //       statusCode: 1,
      //       message: "Thêm user thành công",
      //     });
      //   }
      // });
    // }
  }
};

// Get user by ID
const checkUserNameIsset = function (req, res) {
  var userName = req.params.userUsername;
  User.checkUserName(userName, function (err, user) {
    if (Object.keys(user).length === 0) {
      res.json({
        error: false,
        statusCode: 1,
        message: "Username chưa tồn tại",
      });
    } else {
      res.json({
        error: true,
        statusCode: 0,
        message: "Username đã tồn tại",
      });
    }
  });
};

// Get user by ID
const getUserByID = function (req, res) {
  var userID = req.params.id;
  User.getUserByID(userID, function (err, user) {
    if (err || Object.keys(user).length === 0) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy user",
      });
    } else {
      res.json(user);
    }
  });
};

// Search users
const search = function (req, res) {
  var col = req.query.type;
  var val = req.query.input;
  User.search(col, val, function (err, user) {
    if (err || Object.keys(user).length === 0) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy user",
      });
    } else {
      res.json(user);
    }
  });
};

// Store new user
const update = function (req, res) {
  var newUser = new User(req.body);
  var userID = req.params.id;
  if (
    !newUser.username ||
    !newUser.userusername ||
    !newUser.userpassword ||
    !newUser.usercic ||
    !newUser.usergender ||
    !newUser.useraddress ||
    !newUser.userphone ||
    !newUser.useremail ||
    !newUser.userbanknumber ||
    !newUser.wardid
  ) {
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

// Soft destroy user
const destroy = function (req, res) {
  var userID = req.params.id;
  User.getUserByID(userID, function (err, user) {
    if (err || Object.keys(user).length === 0) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy user",
      });
    } else {
      User.delete(userID, function (err, user) {
        if (err) {
          res.json({
            error: true,
            statusCode: 0,
            message: "Lỗi! Xóa user không thành công",
          });
        } else {
          res.json({
            error: false,
            statusCode: 1,
            message: "Xóa user thành công",
          });
        }
      });
    }
  });
};

// Restore user
const restore = function (req, res) {
  var userID = req.params.id;
  User.getUserByID(userID, function (err, user) {
    if (err || Object.keys(user).length === 0) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy user",
      });
    } else {
      User.restore(userID, function (err, user) {
        if (err) {
          res.json({
            error: true,
            statusCode: 0,
            message: "Lỗi! Khôi phục user không thành công",
          });
        } else {
          res.json({
            error: false,
            statusCode: 1,
            message: "Khôi phục user thành công",
          });
        }
      });
    }
  });
};

module.exports = {
  allUser,
  checkUserNameIsset,
  getUserByID,
  search,
  store,
  update,
  destroy,
  restore,
};
