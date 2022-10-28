const InputInfo = require("../models/InputInfo");

// Show all inputinfo
const allInputInfo = function (req, res) {
  InputInfo.getAll(function (err, inputinfos) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không truy xuất được dữ liệu",
      });
    } else {
      res.json(inputinfos);
    }
  });
};

// Store new inputinfo
const store = function (req, res) {
  var newInputInfo = new InputInfo(req.body);
  if (!newInputInfo.inputinfototalmoney || !newInputInfo.supplierid || !newInputInfo.userid || !newInputInfo.outputinfoid) {
    res.json({
      error: true,
      statusCode: 0,
      message: "Thông tin phiếu nhập không được để trống",
    });
  } else {
    InputInfo.store(newInputInfo, function (err, inputinfo) {
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

// Get inputinfo by ID
const getInputInfoByID = function (req, res) {
  var inputinfoID = req.params.id;
  InputInfo.getInputInfoByID(inputinfoID, function (err, inputinfo) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy tác giả",
      });
    } else {
      res.json(inputinfo);
    }
  })
}

// Store new inputinfo
const update = function (req, res) {
  var newInputInfo = new InputInfo(req.body);
  var inputinfoID = req.params.id;
  if (!newInputInfo.inputinfototalmoney || !newInputInfo.supplierid || !newInputInfo.userid || !newInputInfo.outputinfoid) {
    res.json({
      error: true,
      statusCode: 0,
      message: "Thông tin phiếu nhập không được để trống",
    });
  } else {
    InputInfo.update(inputinfoID, newInputInfo, function (err, inputinfo) {
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
    allInputInfo,
    getInputInfoByID,
    store,
    update,
    // destroy,
}