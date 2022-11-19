const { express } = require("express");
const UserAuth = require("../models/UserAuth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// List token need to refresh
let refreshTokenList = [];

const login = (req, res) => {
  var username = req.body.username;
  var password = req.body.password.toString();

  UserAuth.checkUsernameLogin(username, function (err, user) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        messeage: "Lỗi! Tên tài khoản không đúng",
      });
    } else {
      bcrypt.compare(password, user[0].userpassword, function (error, result) {
        if (error) {
          res.json({
            error: true,
            statusCode: 0,
            message: "Lỗi! Mật khẩu không chính xác",
          });
        } else {
          const role = user[0].roleList[0];
          const accessToken = jwt.sign(
            {
              id: user[0].userid,
              roleCode: role.rolecode,
            },
            process.env.JWT_ACCESS_KEY,
            { expiresIn: "30s" }
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
          console.log(refreshTokenList);

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

          res.json({
            accessToken,
            data: data[0],
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
      statusCode: 0,
      message: "You are not sing in",
    });
  }
  // Check token vailable
  if (!refreshTokenList.includes(refreshToken)) {
    console.log(!refreshTokenList.includes(refreshToken));
    return res.json({
      error: true,
      statusCode: 0,
      message: "Token is not available",
    });
  }

  // Token is available
  jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, function (err, data) {
    if (err) {
      return res.json({
        error: true,
        statusCode: 0,
        message: "JWT had error: " + err.message,
      });
    }

    // refreshTokenList = refreshTokenList.filter((token) => {
    //   token !== refreshToken;
    // });
    const newAccessToken = jwt.sign(
      {
        id: data.id,
        roleCode: data.roleCode,
      },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "30s" }
    );
    // const newRefreshToken = jwt.sign(
    //   {
    //     id: data.id,
    //     roleCode: data.roleCode,
    //   },
    //   process.env.JWT_REFRESH_KEY,
    //   { expiresIn: "30d" }
    // );
    // refreshTokenList.push(newRefreshToken);
    // res.cookie("refreshToken", newRefreshToken, {
    //   httqOnly: true,
    //   secure: false,
    //   path: "/",
    //   sameSite: "strict",
    // });

    res.json({
      newAccessToken,
    });
  });
};

const logout = (req, res) => {
  refreshTokenList = refreshTokenList.filter((token) => {
    token !== refreshToken;
  });
  return res.json({
    error: false,
    statusCode: 1,
    message: "User logout successfully",
  });
}

module.exports = {
  login,
  refreshAccessToken,
  logout,
};
