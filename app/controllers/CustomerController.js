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
      var customerPre = customers.map((customer) => {
        return {
          customerID: customer.customerid,
          customerName: customer.customername,
          customerEmail: customer.cusomeremail,
          customerPassword: customer.customerpassword,
          customerAvatar: customer.customeravatar,
          customerCreateAt: customer.customercreateat,
          customerStatus: customer.customerstatus,
        };
      });
      res.json(customerPre);
    }
  });
};

// Store new customer
const store = function (req, res) {
  var newCustomer = new Customer(req.body);
  if (
    !newCustomer.customername ||
    !newCustomer.customeraddress ||
    !newCustomer.customerpassword ||
    !newCustomer.customeremail ||
    !newCustomer.customerstatus
  ) {
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
    if (err || Object.keys(customer).length === 0) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy khách hàng",
      });
    } else {
      var customerPre = customers.map((customer) => {
        return {
          customerID: customer.customerid,
          customerName: customer.customername,
          customerEmail: customer.cusomeremail,
          customerPassword: customer.customerpassword,
          customerAvatar: customer.customeravatar,
          customerCreateAt: customer.customercreateat,
          customerStatus: customer.customerstatus,
        };
      });
      res.json(customerPre);
    }
  });
};

// Search customers
const search = function (req, res) {
  var col = req.query.type;
  var val = req.query.input;
  Customer.search(col, val, function (err, customer) {
    if (err || Object.keys(customer).length === 0) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy khách hàng",
      });
    } else {
      var customerPre = customers.map((customer) => {
        return {
          customerID: customer.customerid,
          customerName: customer.customername,
          customerEmail: customer.cusomeremail,
          customerPassword: customer.customerpassword,
          customerAvatar: customer.customeravatar,
          customerCreateAt: customer.customercreateat,
          customerStatus: customer.customerstatus,
        };
      });
      res.json(customerPre);
    }
  });
};

// Store new customer
const update = function (req, res) {
  var newCustomer = new Customer(req.body);
  var customerID = req.params.id;
  if (
    !newCustomer.customername ||
    !newCustomer.customeraddress ||
    !newCustomer.customerpassword ||
    !newCustomer.customeremail ||
    !newCustomer.customerstatus
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
  destroy,
  restore,
};
