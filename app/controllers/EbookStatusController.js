const EbookStatus = require("../models/EbookStatus");

// Show all ebookstatus
const allEbookStatus = function (req, res) {
  EbookStatus.getAll(function (err, ebookstatuss) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không truy xuất được dữ liệu",
      });
    } else {
      var ebookstatusPre = ebookstatuss.map((ebookstatus) => {
        return {
          ebookstatusID: ebookstatus.ebookstatusid,
          ebookstatusCode: ebookstatus.ebookstatuscode,
          ebookstatusName: ebookstatus.ebookstatusname,
          ebookstatusColor: ebookstatus.ebookstatuscolor,
        };
      });
      res.json(ebookstatusPre);
    }
  });
};

// Store new ebookstatus
const store = function (req, res) {
  var newEbookStatus = new EbookStatus(req.body);
  if (
    !newEbookStatus.ebookstatuscode ||
    !newEbookStatus.ebookstatusname ||
    !newEbookStatus.ebookstatuscolor
  ) {
    res.json({
      error: true,
      statusCode: 0,
      message: "Thông tin trạng thái ebook không được để trống",
    });
  } else {
    EbookStatus.store(newEbookStatus, function (err, ebookstatus) {
      if (err) {
        res.json({
          error: true,
          statusCode: 0,
          message: "Lỗi! Thêm trạng thái ebook không thành công",
        });
      } else {
        res.json({
          error: false,
          statusCode: 1,
          message: "Thêm trạng thái ebook thành công",
        });
      }
    });
  }
};

// Search ebookstatuss
const search = function (req, res) {
  var col = req.query.type;
  var val = req.query.input;
  EbookStatus.search(col, val, function (err, ebookstatus) {
    if (err || Object.keys(ebookstatus).length === 0) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy trạng thái ebook",
      });
    } else {
      var ebookstatusPre = ebookstatus.map((ebookstatus) => {
        return {
          ebookstatusID: ebookstatus.ebookstatusid,
          ebookstatusCode: ebookstatus.ebookstatuscode,
          ebookstatusName: ebookstatus.ebookstatusname,
          ebookstatusColor: ebookstatus.ebookstatuscolor,
        };
      });
      res.json(ebookstatusPre);
    }
  });
};

// Get ebookstatus by ID
const getEbookStatusByID = function (req, res) {
  var ebookstatusID = req.params.id;
  EbookStatus.getEbookStatusByID(ebookstatusID, function (err, ebookstatus) {
    if (err || Object.keys(ebookstatus).length === 0) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy trạng thái ebook",
      });
    } else {
      var ebookstatusPre = ebookstatus.map((ebookstatus) => {
        return {
          ebookstatusID: ebookstatus.ebookstatusid,
          ebookstatusCode: ebookstatus.ebookstatuscode,
          ebookstatusName: ebookstatus.ebookstatusname,
          ebookstatusColor: ebookstatus.ebookstatuscolor,
          ebookstatusDeletedAt: ebookstatus.ebookstatusdeletedat,
        };
      });
      res.json(ebookstatusPre);
    }
  });
};

// Store new ebookstatus
const update = function (req, res) {
  var newEbookStatus = new EbookStatus(req.body);
  if (
    !newEbookStatus.ebookstatuscode ||
    !newEbookStatus.ebookstatusname ||
    !newEbookStatus.ebookstatuscolor
  ) {
    res.json({
      error: true,
      statusCode: 0,
      message: "Thông tin trạng thái ebook không được để trống",
    });
  } else {
    EbookStatus.update(newEbookStatus, function (err, ebookstatus) {
      if (err) {
        res.json({
          error: true,
          statusCode: 0,
          message: "Lỗi! Cập nhật trạng thái ebook không thành công",
        });
      } else {
        res.json({
          error: false,
          statusCode: 1,
          message: "Cập nhật trạng thái ebook thành công",
        });
      }
    });
  }
};

// Soft destroy ebookstatus
const destroy = function (req, res) {
  var ebookstatusID = req.params.id;
  EbookStatus.getEbookStatusByID(ebookstatusID, function (err, ebookstatus) {
    if (err || Object.keys(ebookstatus).length === 0) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy trạng thái ebook",
      });
    } else {
      EbookStatus.delete(ebookstatusID, function (err, ebookstatus) {
        if (err) {
          res.json({
            error: true,
            statusCode: 0,
            message: "Lỗi! Xóa trạng thái ebook không thành công",
          });
        } else {
          res.json({
            error: false,
            statusCode: 1,
            message: "Xóa trạng thái ebook thành công",
          });
        }
      });
    }
  });
};

// Restore ebookstatus
const restore = function (req, res) {
  var ebookstatusID = req.params.id;
  EbookStatus.getEbookStatusByID(ebookstatusID, function (err, ebookstatus) {
    if (err || Object.keys(ebookstatus).length === 0) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy trạng thái ebook",
      });
    } else {
      EbookStatus.restore(ebookstatusID, function (err, ebookstatus) {
        if (err) {
          res.json({
            error: true,
            statusCode: 0,
            message: "Lỗi! Khôi phục trạng thái ebook không thành công",
          });
        } else {
          res.json({
            error: false,
            statusCode: 1,
            message: "Khôi phục trạng thái ebook thành công",
          });
        }
      });
    }
  });
};

module.exports = {
  allEbookStatus,
  getEbookStatusByID,
  store,
  search,
  update,
  destroy,
  restore,
};
