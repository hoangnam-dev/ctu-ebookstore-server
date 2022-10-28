const Payment = require("../models/Payment");

// Show all payment
const allPayment = function (req, res) {
  Payment.getAll(function (err, payments) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không truy xuất được dữ liệu",
      });
    } else {
      res.json(payments);
    }
  });
};

// Store new payment
const store = function (req, res) {
  var newPayment = new Payment(req.body);
  if (!newPayment.paymentname || !newPayment.paymentnumber || !newPayment.paymenttypeid) {
    res.json({
      error: true,
      statusCode: 0,
      message: "Thông tin phương thức thanh toán không được để trống",
    });
  } else {
    Payment.store(newPayment, function (err, payment) {
      if (err) {
        res.json({
          error: true,
          statusCode: 0,
          message: "Lỗi! Thêm quận/huyện không thành công",
        });
      } else {
        res.json({
          error: false,
          statusCode: 1,
          message: "Thêm quận/huyện thành công",
        });
      }
    });
  }
};

// Get payment by ID
const getPaymentByID = function (req, res) {
  var paymentID = req.params.id;
  Payment.getPaymentByID(paymentID, function (err, payment) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy quận/huyện",
      });
    } else {
      res.json(payment);
    }
  })
}

// Store new payment
const update = function (req, res) {
  var newPayment = new Payment(req.body);
  var paymentID = req.params.id;
  if (!newPayment.paymentname) {
    res.json({
      error: true,
      statusCode: 0,
      message: "Thông tin phương thức thanh toán không được để trống",
    });
  } else {
    Payment.update(paymentID, newPayment, function (err, payment) {
      if (err) {
        res.json({
          error: true,
          statusCode: 0,
          message: "Lỗi! Cập nhật quận/huyện không thành công",
        });
      } else {
        res.json({
          error: false,
          statusCode: 1,
          message: "Cập nhật quận/huyện thành công",
        });
      }
    });
  }
};

module.exports = {
    allPayment,
    getPaymentByID,
    store,
    update,
    // destroy,
}