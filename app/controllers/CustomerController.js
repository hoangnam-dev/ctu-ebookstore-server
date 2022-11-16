const Customer = require("../models/Customer");
const { express } = require("express");
const { cloudinary } = require("../../utils/cloudinary");
const bcrypt = require("bcrypt");
const saltRounds = 10;

// Handle result
function handleResult(arrData) {
  var resData = arrData.map((data) => {
    // Handle role list of the role
    var customerstatusList = data.statusList.map((customerstatus) => {
      return {
        customerstatusID: customerstatus.customerstatusid,
        customerstatusCode: customerstatus.customerstatuscode,
        customerstatusName: customerstatus.customerstatusname,
        customerstatusColor: customerstatus.customerstatuscolor,
      };
    });
    
    // return customer
    return {
      customerID: data.customerid,
      customerName: data.customername,
      customerPhone: data.customerphone,
      customerstatusList: customerstatusList,
    };
  });
  return resData;
}

// Show all customer
const allCustomer = function (req, res) {
  Customer.getAll(function (err, customers) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không truy xuất được dữ liệu",
      });
    } else {
      var listData = handleResult(customers);
      res.json(listData);
    }
  });
};

// Store new customer
const store = async function (req, res) {
  var newCustomer = new Customer(req.body);
  if (
    !newCustomer.customername ||
    !newCustomer.customerpassword ||
    !newCustomer.customeremail ||
    !newCustomer.customerstatusid
  ) {
    res.json({
      error: true,
      statusCode: 0,
      message: "Thông tin khách hàng không được để trống",
    });
  } else {
    try {
      var customerAvt = req.file.path;
      const uploadResponse = await cloudinary.uploader.upload(customerAvt, {
        upload_preset: "ebookstore_customer",
      });
      if (uploadResponse.secure_url) {
        newCustomer.customeravatar = uploadResponse.secure_url;
        bcrypt.hash(req.body.customerPassword, saltRounds, function (err, hash) {
          if (err) {
            res.json({
              error: true,
              statusCode: 0,
              message: "Lỗi! Mã hóa password không thành công",
            });
          }
          newCustomer.customerpassword = hash;
          Customer.store(newCustomer, function (err, customer) {
            if (err) {
              res.json({
                error: true,
                statusCode: 0,
                message: "Lỗi! Thêm khách hàng không thành công",
              });
            } else {
              res.json({
                error: false,
                statusCode: 1,
                message: "Thêm khách hàng thành công",
              });
            }
          });
        });
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

// Get customer by ID
const getCustomerByID = function (req, res) {
  var customerID = req.params.id;
  Customer.getCustomerByID(customerID, function (err, customer) {
    if (err || Object.keys(customer).length === 0) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy khách hàng",
      });
    } else {
      var resData = customer.map((data) => {
        // Handle status list of the customer
        var customerstatusList = data.statusList.map((customerstatus) => {
          return {
            customerstatusID: customerstatus.customerstatusid,
            customerstatusCode: customerstatus.customerstatuscode,
            customerstatusName: customerstatus.customerstatusname,
            customerstatusColor: customerstatus.customerstatuscolor,
          };
        });
        // return customer
        return {
          customerID: data.customerid,
          customerName: data.customername,
          customerEmail: data.customeremail,
          customerPassword: data.customerpassword,
          customerAvatar: data.customeravatar,
          customerCreatedAt: data.customercreatedat,
          customerstatusList: customerstatusList,
        };
      });
      res.json(resData);
    }
  });
};

// Search customers
const search = function (req, res) {
  var col = req.query.type;
  var val = req.query.input;
  Customer.search(col, val, function (err, customers) {
    if (err || Object.keys(customer).length === 0) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy khách hàng",
      });
    } else {
      var listData = handleResult(customers);
      res.json(listData);
    }
  });
};

// Store new customer
const update = function (req, res) {
  var newCustomer = new Customer(req.body);
  var customerID = req.params.id;
  if (
    !newCustomer.customername ||
    !newCustomer.customeremail ||
    !newCustomer.customerstatusid
  ) {
    res.json({
      error: true,
      statusCode: 0,
      message: "Thông tin khách hàng không được để trống",
    });
  } else {
    Customer.update(customerID, newCustomer, function (err, customer) {
      if (err) {
        res.json({
          error: true,
          statusCode: 0,
          message: "Lỗi! Cập nhật khách hàng không thành công",
        });
      } else {
        res.json({
          error: false,
          statusCode: 1,
          message: "Cập nhật khách hàng thành công",
        });
      }
    });
  }
};
// Update customer avatar
const changeAvatar = async function (req, res) {
  var customerID = req.params.id;
  try {
    var customerAvt = req.file.path;
    const uploadResponse = await cloudinary.uploader.upload(customerAvt, {
      upload_preset: "ebookstore_customer",
    });
    if (uploadResponse.secure_url) {
      var customerAvatar = uploadResponse.secure_url;
      Customer.changeAvatar(customerID, customerAvatar, function (err, customer) {
        if (err) {
          res.json({
            error: true,
            statusCode: 0,
            message: "Lỗi! Cập nhật avatar không thành công",
          });
        } else {
          res.json({
            error: false,
            statusCode: 1,
            message: "Cập nhật avatar thành công",
            avatarUrl: customerAvatar,
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

// Update customer password
const changePassword = async function (req, res) {
  var customerID = req.params.id;
  var customerPassword = req.body.customerPassword.toString();
  var passwordOld = req.body.passwordOld.toString();
  Customer.getPassword(customerID, function (err, password) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy khách hàng",
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
        bcrypt.hash(customerPassword, saltRounds, function (err, hash) {
          if (err) {
            res.json({
              error: true,
              statusCode: 0,
              message: "Lỗi! Mã hóa password không thành công",
            });
          } else {
            Customer.changePassword(customerID, hash, function (err, customer) {
              if (err) {
                res.json({
                  error: true,
                  statusCode: 0,
                  message: "Lỗi! Cập nhật customer password không thành công",
                });
              } else {
                res.json({
                  error: false,
                  statusCode: 1,
                  message: "Cập nhật customer password thành công",
                });
              }
            });
          }
        });
      }
    });
  });
};

// Soft destroy customer
const destroy = function (req, res) {
  var customerID = req.params.id;
  Customer.getCustomerByID(customerID, function (err, customer) {
    if (err || Object.keys(customer).length === 0) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy khách hàng",
      });
    } else {
      Customer.delete(customerID, function (err, customer) {
        if (err) {
          res.json({
            error: true,
            statusCode: 0,
            message: "Lỗi! Xóa khách hàng không thành công",
          });
        } else {
          res.json({
            error: false,
            statusCode: 1,
            message: "Xóa khách hàng thành công",
          });
        }
      });
    }
  });
};

// Restore customer
const restore = function (req, res) {
  var customerID = req.params.id;
  Customer.getCustomerByID(customerID, function (err, customer) {
    if (err || Object.keys(customer).length === 0) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy khách hàng",
      });
    } else {
      Customer.restore(customerID, function (err, customer) {
        if (err) {
          res.json({
            error: true,
            statusCode: 0,
            message: "Lỗi! Khôi phục khách hàng không thành công",
          });
        } else {
          res.json({
            error: false,
            statusCode: 1,
            message: "Khôi phục khách hàng thành công",
          });
        }
      });
    }
  });
};

module.exports = {
  allCustomer,
  getCustomerByID,
  search,
  store,
  update,
  changeAvatar,
  changePassword,
  destroy,
  restore,
};
