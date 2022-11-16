const { express } = require("express");
const User = require("../models/User");
const { cloudinary } = require("../../utils/cloudinary");
const bcrypt = require("bcrypt");
const saltRounds = 10;

// Handle result
function handleResult(arrData) {
  var resData = arrData.map((data) => {
    // Handle role list of the role
    var roleList = data.roleList.map((role) => {
      return {
        roleID: role.roleid,
        roleCode: role.rolecode,
        roleName: role.rolename,
        roleDescription: role.roledescription,
      };
    });
    var userstatusList = data.statusList.map((userstatus) => {
      return {
        userstatusID: userstatus.userstatusid,
        userstatusCode: userstatus.userstatuscode,
        userstatusName: userstatus.userstatusname,
        userstatusColor: userstatus.userstatuscolor,
      };
    });

    // return user
    return {
      userID: data.userid,
      userName: data.username,
      userPhone: data.userphone,
      roleList: roleList,
      userstatusList: userstatusList,
    };
  });
  return resData;
}

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
      var listData = handleResult(users);
      res.json(listData);
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
    try {
      var userAvt = req.file.path;
      const uploadResponse = await cloudinary.uploader.upload(userAvt, {
        upload_preset: "ebookstore_user",
      });
      if (uploadResponse.secure_url) {
        newUser.useravatar = uploadResponse.secure_url;
        bcrypt.hash(
          req.body.userPassword.toString(),
          saltRounds,
          function (err, hash) {
            if (err) {
              res.json({
                error: true,
                statusCode: 0,
                message: "Lỗi! Mã hóa password không thành công",
              });
            }
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
          }
        );
      }
    } catch (error) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không thể lưu avatar",
      });
    }
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
      var resData = user.map((data) => {
        // Handle role list of the role
        var roleList = data.roleList.map((role) => {
          return {
            roleID: role.roleid,
            roleCode: role.rolecode,
            roleName: role.rolename,
            roleDescription: role.roledescription,
          };
        });
        var userstatusList = data.statusList.map((userstatus) => {
          return {
            userstatusID: userstatus.userstatusid,
            userstatusCode: userstatus.userstatuscode,
            userstatusName: userstatus.userstatusname,
            userstatusColor: userstatus.userstatuscolor,
          };
        });

        // return user
        return {
          userID: data.userid,
          userName: data.username,
          userUserName: data.userusername,
          userPassword: data.userpassword,
          userCIC: data.usercic,
          userAvatar: data.useravatar,
          userBirthdate: data.userbirthdate,
          userGender: data.usergender,
          userAddress: data.useraddress,
          userEmail: data.useremail,
          userPhone: data.userphone,
          userBankNumber: data.userbanknumber,
          userCreatedAt: data.usercreatedat,
          userAddressSub: data.userAddressSub,
          roleList: roleList,
          userstatusList: userstatusList,
        };
      });
      res.json(resData);
    }
  });
};

// Search users
const search = function (req, res) {
  var col = req.query.type;
  var val = req.query.input;
  User.search(col, val, function (err, users) {
    if (err || Object.keys(user).length === 0) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy user",
      });
    } else {
      var listData = handleResult(users);
      res.json(listData);
    }
  });
};

// Update user info
const update = async function (req, res) {
  var newUser = new User(req.body);
  var userID = req.params.id;
  if (
    !newUser.username ||
    !newUser.userbirthdate ||
    !newUser.usergender ||
    !newUser.useraddress ||
    !newUser.usercic ||
    !newUser.useremail ||
    !newUser.userphone ||
    !newUser.userbanknumber ||
    !newUser.userstatusid ||
    !newUser.roleid ||
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
          message: "Lỗi! Cập nhật thông tin user không thành công",
        });
      } else {
        res.json({
          error: false,
          statusCode: 1,
          message: "Cập nhật thông tin user thành công",
        });
      }
    });
  }
};

// Update user avatar
const changeAvatar = async function (req, res) {
  var userID = req.params.id;
  try {
    var userAvt = req.file.path;
    const uploadResponse = await cloudinary.uploader.upload(userAvt, {
      upload_preset: "ebookstore_user",
    });
    if (uploadResponse.secure_url) {
      var userAvatar = uploadResponse.secure_url;
      User.changeAvatar(userID, userAvatar, function (err, user) {
        if (err) {
          res.json({
            error: true,
            statusCode: 0,
            message: "Lỗi! Cập nhật user avatar không thành công",
          });
        } else {
          res.json({
            error: false,
            statusCode: 1,
            message: "Cập nhật user avatar thành công",
            avatarUrl: userAvatar,
          });
        }
      });
    }
  } catch (error) {
    res.json({
      error: true,
      statusCode: 0,
      message: "Lỗi! Không thể lưu avatar",
    });
  }
};

// Update user password
const changePassword = async function (req, res) {
  var userID = req.params.id;
  var userPassword = req.body.userPassword.toString();
  var passwordOld = req.body.passwordOld.toString();
  User.getPassword(userID, function (err, password) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy user",
      });
    }
    bcrypt.compare(passwordOld, password, function (err, result) {
      if (err) {
        res.json({
          error: true,
          statusCode: 0,
          message: "Lỗi! Không thể so sánh mật khẩu",
        });
      }
      if (!result) {
        res.json({
          error: true,
          statusCode: 0,
          message: "Lỗi! Mật khẫu cũ không trùng khớp",
        });
      } else {
        bcrypt.hash(userPassword, saltRounds, function (err, hash) {
          if (err) {
            res.json({
              error: true,
              statusCode: 0,
              message: "Lỗi! Mã hóa password không thành công",
            });
          } else {
            User.changePassword(userID, hash, function (err, user) {
              if (err) {
                res.json({
                  error: true,
                  statusCode: 0,
                  message: "Lỗi! Cập nhật user password không thành công",
                });
              } else {
                res.json({
                  error: false,
                  statusCode: 1,
                  message: "Cập nhật user password thành công",
                });
              }
            });
          }
        });
      }
    });
  });
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
  changeAvatar,
  changePassword,
  destroy,
  restore,
};
