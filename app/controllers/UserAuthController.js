const express = require("express");
const UserAuth = require("../models/UserAuth");
const { cloudinary } = require("../../utils/cloudinary");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
require("dotenv").config();

// List token need to refresh
let refreshTokenList = [];

// Account status
const active = "active";
const blocked = "blocked";
const author_wrong = "author_wrong";
const author_null = "author_null";
const author_blocked = "author_block";

const login = (req, res) => {
  var username = req.body.username;
  var password = req.body.password.toString();

  UserAuth.checkUsernameLogin(username, function (err, user) {
    if (err || Object.keys(user).length === 0) {
      return res.json({
        error: true,
        statusCode: author_wrong,
        message: "Tài khoản hoặc mật khẩu không chính xác",
      });
    } else {
      // Check account status
      let accountStatus = user[0].statusList[0].userstatuscode;
      if (accountStatus === blocked) {
        return res.json({
          error: true,
          statusCode: author_blocked,
          message: "Tài khoản đã bị khóa",
        });
      }
      // Check password
      bcrypt.compare(password, user[0].userpassword, function (error, result) {
        if (error || !result) {
          res.json({
            error: true,
            statusCode: author_wrong,
            message: "Tài khoản hoặc mật khẩu không chính xác",
          });
        } else {
          const role = user[0].roleList[0];
          const accessToken = jwt.sign(
            {
              id: user[0].userid,
              roleCode: role.rolecode,
            },
            process.env.JWT_ACCESS_KEY,
            { expiresIn: "30d" }
          );

          const refreshToken = jwt.sign(
            {
              id: user[0].userid,
              roleCode: role.rolecode,
            },
            process.env.JWT_REFRESH_KEY,
            { expiresIn: "30d" }
          );

          refreshTokenList.push(refreshToken);
          res.cookie("refreshToken", refreshToken, {
            httqOnly: true,
            secure: false,
            path: "/",
            sameSite: "strict",
          });

          // result user info
          var data = user.map((data) => {
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
              roleID: roleList[0].roleID,
              roleName: roleList[0].roleName,
              permissionList: data.permissionList,
              userstatusCode: userstatusList[0].userstatusCode,
            };
          });

          res.json({
            accessToken,
            userInfo: data[0],
          });
        }
      });
    }
  });
};

const refreshAccessToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  // Check token isset
  if (!refreshToken) {
    return res.json({
      error: true,
      statusCode: author_null,
      message: "Bạn chưa đăng nhập",
    });
  }
  // Check token vailable
  if (!refreshTokenList.includes(refreshToken)) {
    return res.json({
      error: true,
      statusCode: author_null,
      message: "Bạn chưa đăng nhập",
    });
  }

  // Token is available
  jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, function (err, data) {
    if (err) {
      return res.json({
        error: true,
        statusCode: author_null,
        message: "Bạn chưa đăng nhập",
      });
    }

    const newAccessToken = jwt.sign(
      {
        id: data.id,
        roleCode: data.roleCode,
      },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "30s" }
    );
    res.json({
      newAccessToken,
    });
  });
};

const logout = (req, res) => {
  refreshTokenList = refreshTokenList.filter((token) => {
    token !== req.cookies.refreshToken;
  });
  return res.json({
    error: false,
    statusCode: 1,
    message: "Bạn đã đăng xuất thành công",
  });
};

const profile = (req, res) => {
  const token = req.headers.token;

  if (token) {
    const accessToken = token.split(" ")[1];
    jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, function (err, data) {
      if (err) {
        return res.json({
          error: true,
          statusCode: author_null,
          message: "Bạn chưa đăng nhập",
        });
      }

      UserAuth.profile(data.id, function (err, user) {
        if (err) {
          return res.json({
            error: true,
            statusCode: author_null,
            message: "Không thể lấy thông tin user",
          });
        } else {
          // result user info
          var userInfo = user.map((data) => {
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
              roleID: roleList[0].roleID,
              roleName: roleList[0].roleName,
              permissionList: data.permissionList,
              userstatusCode: userstatusList[0].userstatusCode,
            };
          });

          res.json(userInfo[0]);
        }
      });
    });
  } else {
    return res.json({
      error: true,
      statusCode: author_null,
      message: "Bạn chưa đăng nhập",
    });
  }
};

const updateProfile = async function (req, res) {
  var newUser = new UserAuth(req.body);
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
    !newUser.wardid
  ) {
    res.json({
      error: true,
      statusCode: 0,
      message: "Thông tin user không được để trống",
    });
  } else {
    UserAuth.update(userID, newUser, function (err, user) {
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
      UserAuth.changeAvatar(userID, userAvatar, function (err, user) {
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
  UserAuth.getPassword(userID, function (err, password) {
    if (err) {
      return res.json({
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
            UserAuth.changePassword(userID, hash, function (err, user) {
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

module.exports = {
  login,
  refreshAccessToken,
  logout,
  profile,
  updateProfile,
  changeAvatar,
  changePassword,
};
