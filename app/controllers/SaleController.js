const Sale = require("../models/Sale");

// Show all sale
const allSale = function (req, res) {
  Sale.getAll(function (err, sales) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không truy xuất được dữ liệu",
      });
    } else {
      res.json(sales);
    }
  });
};

// Store new sale
const store = function (req, res) {
  var newSale = new Sale(req.body);
  if (!newSale.salecode || !newSale.salevalue || !newSale.salestartat || !newSale.saleendat) {
    res.json({
      error: true,
      statusCode: 0,
      message: "Thông tin khuyến mãi không được để trống",
    });
  } else {
    Sale.store(newSale, function (err, sale) {
      if (err) {
        res.json({
          error: true,
          statusCode: 0,
          message: "Lỗi! Thêm khuyến mãi không thành công",
        });
      } else {
        res.json({
          error: false,
          statusCode: 1,
          message: "Thêm khuyến mãi thành công",
        });
      }
    });
  }
};

// Get sale by ID
const getSaleByID = function (req, res) {
  var saleID = req.params.id;
  Sale.getSaleByID(saleID, function (err, sale) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy khuyến mãi",
      });
    } else {
      res.json(sale);
    }
  })
}

// Store new sale
const update = function (req, res) {
  var newSale = new Sale(req.body);
  var saleID = req.params.id;
  if (!newSale.salecode || !newSale.salevalue || !newSale.salestartat || !newSale.saleendat) {
    res.json({
      error: true,
      statusCode: 0,
      message: "Thông tin khuyến mãi không được để trống",
    });
  } else {
    Sale.update(saleID, newSale, function (err, sale) {
      if (err) {
        res.json({
          error: true,
          statusCode: 0,
          message: "Lỗi! Cập nhật khuyến mãi không thành công",
        });
      } else {
        res.json({
          error: false,
          statusCode: 1,
          message: "Cập nhật khuyến mãi thành công",
        });
      }
    });
  }
};

module.exports = {
    allSale,
    getSaleByID,
    store,
    update,
    // destroy,
}