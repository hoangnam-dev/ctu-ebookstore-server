const Order = require("../models/Order");

// Show all order
const allOrder = function (req, res) {
  Order.getAll(function (err, orders) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không truy xuất được dữ liệu",
      });
    } else {
      res.json(orders);
    }
  });
};

// Store new order
const store = function (req, res) {
  var newOrder = new Order(req.body);
  if (!newOrder.ordertotalprice) {
    res.json({
      error: true,
      statusCode: 0,
      message: "Tạo đơn hàng không được để trống",
    });
  } else {
    Order.store(newOrder, function (err, order) {
      if (err) {
        res.json({
          error: true,
          statusCode: 0,
          message: "Lỗi! Thêm tác giả không thành công",
        });
      } else {
        res.json({
          error: false,
          statusCode: 1,
          message: "Thêm tác giả thành công",
        });
      }
    });
  }
};

// Get order by ID
const getOrderByID = function (req, res) {
  var orderID = req.params.id;
  Order.getOrderByID(orderID, function (err, order) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy tác giả",
      });
    } else {
      res.json(order);
    }
  })
}

// Store new order
const update = function (req, res) {
  var newOrder = new Order(req.body);
  var orderID = req.params.id;
  if (!newOrder.ordername) {
    res.json({
      error: true,
      statusCode: 0,
      message: "Tên tác giả không được để trống",
    });
  } else {
    Order.update(orderID, newOrder, function (err, order) {
      if (err) {
        res.json({
          error: true,
          statusCode: 0,
          message: "Lỗi! Cập nhật tác giả không thành công",
        });
      } else {
        res.json({
          error: false,
          statusCode: 1,
          message: "Cập nhật tác giả thành công",
        });
      }
    });
  }
};

module.exports = {
    allOrder,
    getOrderByID,
    store,
    update,
    // destroy,
}