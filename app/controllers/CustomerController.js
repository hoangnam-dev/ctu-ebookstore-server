const Customer = require("../models/Customer");

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
      res.json(customers);
    }
  });
};

// Store new customer
const store = function (req, res) {
  var newCustomer = new Customer(req.body);
  if (!newCustomer.customername || !newCustomer.customeraddress || !newCustomer.customerpassword || !newCustomer.customeremail || !newCustomer.customerstatus) {
    res.json({
      error: true,
      statusCode: 0,
      message: "Thông tin khách hàng không được để trống",
    });
  } else {
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
  }
};

// Get customer by ID
const getCustomerByID = function (req, res) {
  var customerID = req.params.id;
  Customer.getCustomerByID(customerID, function (err, customer) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy khách hàng",
      });
    } else {
      res.json(customer);
    }
  })
}

// Store new customer
const update = function (req, res) {
  var newCustomer = new Customer(req.body);
  var customerID = req.params.id;
  if (!newCustomer.customername || !newCustomer.customeraddress || !newCustomer.customerpassword || !newCustomer.customeremail || !newCustomer.customerstatus) {
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

module.exports = {
    allCustomer,
    getCustomerByID,
    store,
    update,
    // destroy,
}