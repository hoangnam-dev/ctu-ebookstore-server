const OutputInfo = require("../models/OutputInfo");

// Show all outputinfo
const allOutputInfo = function (req, res) {
  OutputInfo.getAll(function (err, outputinfos) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không truy xuất được dữ liệu",
      });
    } else {
      res.json(outputinfos);
    }
  });
};

// Store new outputinfo
const store = function (req, res) {
  var newOutputInfo = new OutputInfo(req.body);
  if (!newOutputInfo.outputinfototalmoney || !newOutputInfo.supplierid || !newOutputInfo.userid) {
    res.json({
      error: true,
      statusCode: 0,
      message: "Thông tin phiếu chi không được để trống",
    });
  } else {
    OutputInfo.store(newOutputInfo, function (err, outputinfo) {
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

// Get outputinfo by ID
const getOutputInfoByID = function (req, res) {
  var outputinfoID = req.params.id;
  OutputInfo.getOutputInfoByID(outputinfoID, function (err, outputinfo) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy tác giả",
      });
    } else {
      res.json(outputinfo);
    }
  })
}

// Store new outputinfo
const update = function (req, res) {
  var newOutputInfo = new OutputInfo(req.body);
  var outputinfoID = req.params.id;
  if (!newOutputInfo.outputinfototalmoney || !newOutputInfo.supplierid || !newOutputInfo.userid) {
    res.json({
      error: true,
      statusCode: 0,
      message: "Thông tin phiếu chi không được để trống",
    });
  } else {
    OutputInfo.update(outputinfoID, newOutputInfo, function (err, outputinfo) {
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
    allOutputInfo,
    getOutputInfoByID,
    store,
    update,
    // destroy,
}