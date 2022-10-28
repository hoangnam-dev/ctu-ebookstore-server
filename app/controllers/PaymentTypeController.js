const PaymentType = require("../models/PaymentType");

// Show all paymenttype
const allPaymentType = function (req, res) {
  PaymentType.getAll(function (err, paymenttypes) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không truy xuất được dữ liệu",
      });
    } else {
      res.json(paymenttypes);
    }
  });
};

// Store new paymenttype
const store = function (req, res) {
  var newPaymentType = new PaymentType(req.body);
  if (!newPaymentType.paymenttypename) {
    res.json({
      error: true,
      statusCode:1,
      message: "Tên loại phương thức thanh toán không được để trống",
    });
  } else {
    PaymentType.store(newPaymentType, function (err, paymenttype) {
      if (err) {
        res.json({
          error: true,
          statusCode: 0,
          message: "Lỗi! Tạo loại phương thức thanh toán không thành công",
        });
      } else {
        res.json({
          error: false,
          statusCode: 1,
          message: "Tạo loại phương thức thanh toán thành công",
        });
      }
    });
  }
};

// Get paymenttype by ID
const getPaymentTypeByID = function (req, res) {
  var paymenttypeID = req.params.id;
  PaymentType.getPaymentTypeByID(paymenttypeID, function (err, paymenttype) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy loại phương thức thanh toán",
      });
    } else {
      res.json(paymenttype);
    }
  })
}

// Store new paymenttype
const update = function (req, res) {
  var newPaymentType = new PaymentType(req.body);
  var paymenttypeID = req.params.id;
  if (!newPaymentType.paymenttypename) {
    res.json({
      error: true,
      statusCode: 0,
      message: "Tên loại phương thức thanh toán không được để trống",
    });
  } else {
    PaymentType.update(paymenttypeID, newPaymentType, function (err, paymenttype) {
      if (err) {
        res.json({
          error: true,
          statusCode: 0,
          message: "Lỗi! Cập nhật loại phương thức thanh toán không thành công",
        });
      } else {
        res.json({
          error: false,
          statusCode: 1,
          message: "Cập nhật loại phương thức thanh toán thành công",
        });
      }
    });
  }
};

module.exports = {
    allPaymentType,
    getPaymentTypeByID,
    store,
    update,
    // destroy,
}