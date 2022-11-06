const CustomerStatus = require("../models/CustomerStatus");

// Show all customerstatus
const allCustomerStatus = function (req, res) {
  CustomerStatus.getAll(function (err, customerstatuss) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không truy xuất được dữ liệu",
      });
    } else {
      var customerstatusPre = customerstatuss.map((customerstatus) => {
        return {
          customerstatusID: customerstatus.customerstatusid,
          customerstatusCode: customerstatus.customerstatuscode,
          customerstatusName: customerstatus.customerstatusname,
          customerstatusColor: customerstatus.customerstatuscolor,
        };
      });
      res.json(customerstatusPre);
    }
  });
};

// Store new customerstatus
const store = function (req, res) {
  var newCustomerStatus = new CustomerStatus(req.body);
  if (
    !newCustomerStatus.customerstatuscode ||
    !newCustomerStatus.customerstatusname ||
    !newCustomerStatus.customerstatuscolor
  ) {
    res.json({
      error: true,
      statusCode: 0,
      message: "Thông tin trạng thái khách hàng không được để trống",
    });
  } else {
    CustomerStatus.store(newCustomerStatus, function (err, customerstatus) {
      if (err) {
        res.json({
          error: true,
          statusCode: 0,
          message: "Lỗi! Thêm trạng thái khách hàng không thành công",
        });
      } else {
        res.json({
          error: false,
          statusCode: 1,
          message: "Thêm trạng thái khách hàng thành công",
        });
      }
    });
  }
};

// Search customerstatuss
const search = function (req, res) {
  var col = req.query.type;
  var val = req.query.input;
  CustomerStatus.search(col, val, function (err, customerstatus) {
    if (err || Object.keys(customerstatus).length === 0) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy trạng thái khách hàng",
      });
    } else {
      var customerstatusPre = customerstatus.map((customerstatus) => {
        return {
          customerstatusID: customerstatus.customerstatusid,
          customerstatusCode: customerstatus.customerstatuscode,
          customerstatusName: customerstatus.customerstatusname,
          customerstatusColor: customerstatus.customerstatuscolor,
        };
      });
      res.json(customerstatusPre);
    }
  });
};

// Get customerstatus by ID
const getCustomerStatusByID = function (req, res) {
  var customerstatusID = req.params.id;
  CustomerStatus.getCustomerStatusByID(customerstatusID, function (err, customerstatus) {
    if (err || Object.keys(customerstatus).length === 0) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy trạng thái khách hàng",
      });
    } else {
      var customerstatusPre = customerstatus.map((customerstatus) => {
        return {
          customerstatusID: customerstatus.customerstatusid,
          customerstatusCode: customerstatus.customerstatuscode,
          customerstatusName: customerstatus.customerstatusname,
          customerstatusColor: customerstatus.customerstatuscolor,
          customerstatusDeletedAt: customerstatus.customerstatusdeletedat,
        };
      });
      res.json(customerstatusPre);
    }
  });
};

// Store new customerstatus
const update = function (req, res) {
  var newCustomerStatus = new CustomerStatus(req.body);
  if (
    !newCustomerStatus.customerstatuscode ||
    !newCustomerStatus.customerstatusname ||
    !newCustomerStatus.customerstatuscolor
  ) {
    res.json({
      error: true,
      statusCode: 0,
      message: "Thông tin trạng thái khách hàng không được để trống",
    });
  } else {
    CustomerStatus.update(newCustomerStatus, function (err, customerstatus) {
      if (err) {
        res.json({
          error: true,
          statusCode: 0,
          message: "Lỗi! Cập nhật trạng thái khách hàng không thành công",
        });
      } else {
        res.json({
          error: false,
          statusCode: 1,
          message: "Cập nhật trạng thái khách hàng thành công",
        });
      }
    });
  }
};

// Soft destroy customerstatus
const destroy = function (req, res) {
  var customerstatusID = req.params.id;
  CustomerStatus.getCustomerStatusByID(customerstatusID, function (err, customerstatus) {
    if (err || Object.keys(customerstatus).length === 0) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy trạng thái khách hàng",
      });
    } else {
      CustomerStatus.delete(customerstatusID, function (err, customerstatus) {
        if (err) {
          res.json({
            error: true,
            statusCode: 0,
            message: "Lỗi! Xóa trạng thái khách hàng không thành công",
          });
        } else {
          res.json({
            error: false,
            statusCode: 1,
            message: "Xóa trạng thái khách hàng thành công",
          });
        }
      });
    }
  });
};

// Restore customerstatus
const restore = function (req, res) {
  var customerstatusID = req.params.id;
  CustomerStatus.getCustomerStatusByID(customerstatusID, function (err, customerstatus) {
    if (err || Object.keys(customerstatus).length === 0) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy trạng thái khách hàng",
      });
    } else {
      CustomerStatus.restore(customerstatusID, function (err, customerstatus) {
        if (err) {
          res.json({
            error: true,
            statusCode: 0,
            message: "Lỗi! Khôi phục trạng thái khách hàng không thành công",
          });
        } else {
          res.json({
            error: false,
            statusCode: 1,
            message: "Khôi phục trạng thái khách hàng thành công",
          });
        }
      });
    }
  });
};

module.exports = {
  allCustomerStatus,
  getCustomerStatusByID,
  store,
  search,
  update,
  destroy,
  restore,
};
