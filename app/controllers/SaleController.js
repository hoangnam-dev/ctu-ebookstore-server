const Sale = require("../models/Sale");
const SaleDetail = require("../models/SaleDetail");
const moment = require("moment");
const fs = require("fs");

// Handle result
function handleResult(arrData) {
  var resData = arrData.map((data) => {
    // return sale
    return {
      saleID: data.saleid,
      saleName: data.salename,
      saleContent: data.salecontent,
      saleStartAt: data.salestartat,
      saleEndAt: data.saleendat,
    };
  });
  return resData;
}

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
      var listSale = handleResult(sales);
      res.json(listSale);
    }
  });
};

// Store new sale
const store = function (req, res) {
  var newSale = new Sale(req.body);
  var saleDetail = req.body.saleDetail;
  if (
    !newSale.salename ||
    !newSale.salecontent ||
    !newSale.salestartat ||
    !newSale.saleendat
  ) {
    res.json({
      error: true,
      statusCode: 0,
      message: "Thông tin khuyến mãi không được để trống",
    });
  } else {
    let startAt = moment(newSale.salestartat);
    let endAt = moment(newSale.saleendat);
    var diffTime = startAt.diff(
      endAt,
      "years",
      "months",
      "days",
      "hours",
      "minutes",
      "seconds"
    );
    if (diffTime > 0) {
      return res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc",
      });
    }
    Sale.store( newSale, saleDetail, function (err, sale) {
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
      }
    );
  }
};

// Get sale by ID
const getSaleByID = function (req, res) {
  var saleID = req.params.id;
  Sale.getSaleByID(saleID, async function (err, sale) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy khuyến mãi",
      });
    } else {
      var resData = sale.map((data) => {
        var detailList = data.detailList.map((item) => {
          return {
            ebookID: item.ebookid,
            ebookName: item.ebookname,
            ebookAvatar: item.ebookavatar,
            ebookPrice: item.ebookprice,
            saleValue: item.salevalue
          }
        });
        // return sale
        return {
          saleID: data.saleid,
          saleName: data.salename,
          saleContent: data.salecontent,
          saleStartAt: data.salestartat,
          saleEndAt: data.saleendat,
          detailList: detailList
        };
      });
      res.json(resData[0]);
    }
  });
};

// Search sales
const search = function (req, res) {
  var col = req.query.type;
  var val = req.query.input;
  console.log("col");
  Sale.search(col, val, function (err, sale) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy khuyến mãi",
      });
    } else {
      var listSale = handleResult(sale);
      res.json(listSale);
    }
  });
};

// Store new sale
const update = function (req, res) {
  var newSale = new Sale(req.body);
  var saleID = req.params.id;
  if (
    !newSale.salename ||
    !newSale.salecontent ||
    !newSale.salestartat ||
    !newSale.saleendat
  ) {
    res.json({
      error: true,
      statusCode: 0,
      message: "Thông tin khuyến mãi không được để trống",
    });
  } else {
    let startAt = moment(newSale.salestartat);
    let endAt = moment(newSale.saleendat);
    var diffTime = startAt.diff(
      endAt,
      "years",
      "months",
      "days",
      "hours",
      "minutes",
      "seconds"
    );
    if (diffTime > 0) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Thời gian bắt đầu lớn hơn thời gian kết thúc",
      });
    }
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

// Delete sale
const destroy = function (req, res) {
  var saleID = req.params.id;
  Sale.getSaleByID(saleID, function (err, sale) {
    if (err || Object.keys(sale).length === 0) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy khuyến mãi",
      });
    } else {
      Sale.delete(saleID, function (err, sale) {
        if (err) {
          res.json({
            error: true,
            statusCode: 0,
            message: "Lỗi! Xóa khuyến mãi không thành công",
          });
        } else {
          res.json({
            error: false,
            statusCode: 1,
            message: "Xóa khuyến mãi thành công",
          });
        }
      });
    }
  });
};

// sale detail
const addDetail = (req, res) => {
  var newDetail = new SaleDetail(req.body);

  if (!newDetail.saleid || !newDetail.ebookid || !newDetail.salevalue) {
    return res.json({
      error: false,
      statusCode: 0,
      message: "Chi tiết khuyến mãi không được trống",
    });
  } else {
    SaleDetail.store(newDetail, (err, result) => {
      if(err) {
        return res.json({
          error: false,
          statusCode: 0,
          message: "Thêm chi tiết khuyến mãi không thành công",
        });
      } else {
        return res.json({
          error: false,
          statusCode: 1,
          message: "Thêm chi tiết khuyến mãi thành công",
        });
      }
    });
  }
};
const deleteDetail = (req, res) => {
  var saleID = req.body.saleID;
  var ebookID = req.body.ebookID;

  if (!saleID || !ebookID) {
    return res.json({
      error: false,
      statusCode: 1,
      message: "Không tìm thấy mã khuyến mãi",
    });
  } else {
    SaleDetail.delete(saleID, ebookID, (err, result) => {
      if(err) {
        return res.json({
          error: false,
          statusCode: 0,
          message: "Xóa chi tiết khuyến mãi không thành công",
        });
      } else {
        return res.json({
          error: false,
          statusCode: 1,
          message: "Xóa chi tiết khuyến mãi thành công",
        });
      }
    });
  }
};

module.exports = {
  allSale,
  getSaleByID,
  search,
  store,
  update,
  destroy,
  addDetail,
  deleteDetail
};
