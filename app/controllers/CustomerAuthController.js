const { express } = require("express");
const CustomerAuth = require("../models/CustomerAuth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// List token need to refresh
let refreshTokenList = [];

// Account status
const active = "active";
const blocked = "blocked";

const login = (req, res) => {
  var email = req.body.email;
  var password = req.body.password.toString();

  CustomerAuth.checkCustomerLogin(email, function (err, customer) {
    if (err || Object.keys(customer).length === 0) {
      return res.json({
        error: true,
        statusCode: 0,
        messeage: "Lỗi! Email không đúng",
      });
    } else {
      // Check account status
      let accountStatus = customer[0].statusList[0].customerstatuscode;
      if (accountStatus === blocked) {
        return res.json({
          error: true,
          statusCode: 0,
          messeage: "Lỗi! Tài khoản đã bị khóa",
        });
      }
      // Check password
      bcrypt.compare(password, customer[0].customerpassword, function (error, result) {
        if (error || !result) {
          res.json({
            error: true,
            statusCode: 0,
            message: "Lỗi! Mật khẩu không chính xác",
          });
        } else {
          const accessToken = jwt.sign(
            {
              id: customer[0].customerid,
            },
            process.env.JWT_ACCESS_KEY,
            { expiresIn: "30d" }
          );

          const refreshToken = jwt.sign(
            {
              id: customer[0].customerid,
            },
            process.env.JWT_REFRESH_KEY,
            { expiresIn: "30d" }
          );

          refreshTokenList.push(refreshToken);
          res.cookie("refreshCustomerToken", refreshToken, {
            httqOnly: true,
            secure: false,
            path: "/",
            sameSite: "strict",
          });

          // result customer info
          var data = customer.map((data) => {
            var customerstatusList = data.statusList.map((customerstatus) => {
              return {
                customerstatusID: customerstatus.customerstatusid,
                customerstatusCode: customerstatus.customerstatuscode,
                customerstatusName: customerstatus.customerstatusname,
                customerstatusColor: customerstatus.customerstatuscolor,
              };
            });
            var ebookOwnList = data.ebookOwnList.map((ebookOwn) => {
              return {
                ebookID: ebookOwn.ebookid,
                licenseID: ebookOwn.licenseid,
                licenseIsRent: ebookOwn.licenseisrent,
                licenseStatus: ebookOwn.licensestatus,
                licenseExpires: ebookOwn.licenseexpires,
              };
            });

            // return customer
            return {
              customerID: data.customerid,
              customerName: data.customername,
              customerUserName: data.customercustomername,
              customerAvatar: data.customeravatar,
              customerAddress: data.customeraddress,
              customerEmail: data.customeremail,
              customerCreatedAt: data.customercreatedat,
              customerstatusCode: customerstatusList[0].customerstatusCode,
              ebookOwnList: ebookOwnList,
            };
          });

          res.json({
            accessToken,
            customerInfo: data[0],
          });
        }
      });
    }
  });
};

const refreshAccessToken = (req, res) => {
  const refreshToken = req.cookies.refreshCustomerToken;

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
    CustomerAuth.getCustomerLoginInfo(data.id, function(err, customerInfo) {
        if(err) {
            return res.json({
                error: true,
                statusCode: 0,
                message: "Lỗi! Không thể lấy thông tin khách hàng",
            });
        } else {
            const newAccessToken = jwt.sign(
              {
                id: customerInfo[0].customerid,
              },
              process.env.JWT_ACCESS_KEY,
              { expiresIn: "30m" }
            );
            // result customer info
          var info = customerInfo.map((data) => {
            var customerstatusList = data.statusList.map((customerstatus) => {
              return {
                customerstatusID: customerstatus.customerstatusid,
                customerstatusCode: customerstatus.customerstatuscode,
                customerstatusName: customerstatus.customerstatusname,
                customerstatusColor: customerstatus.customerstatuscolor,
              };
            });
            var ebookOwnList = data.ebookOwnList.map((ebookOwn) => {
              return {
                ebookID: ebookOwn.ebookid,
                licenseID: ebookOwn.licenseid,
                licenseIsRent: ebookOwn.licenseisrent,
                licenseStatus: ebookOwn.licensestatus,
                licenseExpires: ebookOwn.licenseexpires,
              };
            });

            // return customer
            return {
              customerID: data.customerid,
              customerName: data.customername,
              customerUserName: data.customercustomername,
              customerAvatar: data.customeravatar,
              customerAddress: data.customeraddress,
              customerEmail: data.customeremail,
              customerCreatedAt: data.customercreatedat,
              customerstatusCode: customerstatusList[0].customerstatusCode,
              ebookOwnList: ebookOwnList,
            };
          });

          res.json({
            newAccessToken,
            customerInfo: info[0],
          });
        }
    });

  });
};

const logout = (req, res) => {
  refreshTokenList = refreshTokenList.filter((token) => {
    token !== req.cookies.refreshCustomerToken;
  });
  return res.json({
    error: false,
    statusCode: 1,
    message: "Customer logout successfully",
  });
};

module.exports = {
  login,
  refreshAccessToken,
  logout,
};
