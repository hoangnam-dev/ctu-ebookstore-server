const OutputInfo = require("../models/OutputInfo");

// Handle result
function handleResult(arrData) {
  var resData = arrData.map((data) => {
    // Handle user list of the outputinfo
    var user = data.userList.map((d) => {
      return {
        userID: d.userid,
        userName: d.username,
      };
    });
    // Handle supplier list of the outputinfo
    var supplier = data.supplierList.map((d) => {
      return {
        supplierID: d.supplierid,
        supplierCode: d.suppliercode,
        supplierName: d.suppliername,
        supplierDescription: d.supplierdescription,
      };
    });
    // Handle inputinfo list of the outputinfo
    var inputinfo = data.inputinfoList.map((d) => {
      return {
        inputinfoID: d.inputinfoid,
        inputinfoTotalMoney: d.inputinfototalmoney,
        inputinfoCreateAt: d.inputinfocreatedat,
      };
    });

    // return outputinfo
    return {
      outputinfoID: data.outputinfoid,
      outputinfoDescription: data.outputinfodescription,
      outputinfoTotalMoney: data.outputinfototalmoney,
      outputinfoCreatedAt: data.outputinfocreatedat,
      user: user,
      supplier: supplier,
      inputinfoList: inputinfo,
    };
  });
  return resData;
}

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
      var outputinfoPre = outputinfos.map((outputinfo) => {
        return {
          outputinfoID: outputinfo.outputinfoid,
          outputinfoTotalMoney: outputinfo.outputinfototalmoney,
          outputinfoCreatedAt: outputinfo.outputinfocreatedat,
          supplierName: outputinfo.suppliername,
        };
      });
      res.json(outputinfoPre);
    }
  });
};

// Store new outputinfo
const store = function (req, res) {
  var newOutputInfo = new OutputInfo(req.body);
  if (
    !newOutputInfo.outputinfototalmoney ||
    !newOutputInfo.supplierid ||
    !newOutputInfo.userid
  ) {
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
          message: "Lỗi! Thêm phiếu chi không thành công",
        });
      } else {
        res.json({
          error: false,
          statusCode: 1,
          message: "Thêm phiếu chi thành công",
        });
      }
    });
  }
};

// Search outputinfo
const search = function (req, res) {
  var col = req.query.type;
  var val = req.query.input;
  OutputInfo.search(col, val, function (err, outputinfo) {
    if (err || Object.keys(outputinfo).length === 0) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy phiếu chi",
      });
    } else {
      var outputinfoPre = outputinfo.map((outputinfo) => {
        return {
          outputinfoID: outputinfo.outputinfoid,
          outputinfoTotalMoney: outputinfo.outputinfototalmoney,
          outputinfoCreatedAt: outputinfo.outputinfocreatedat,
          supplierName: outputinfo.suppliername,
        };
      });
      res.json(outputinfoPre);
    }
  });
};

// Get outputinfo by ID
const getOutputInfoByID = function (req, res) {
  var outputinfoID = req.params.id;
  OutputInfo.getOutputInfoByID(outputinfoID, function (err, outputinfo) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy phiếu chi",
      });
    } else {
      var listOutputInfo = handleResult(outputinfo);
      res.json(listOutputInfo);
    }
  });
};

// Store new outputinfo
const update = function (req, res) {
  var newOutputInfo = new OutputInfo(req.body);
  var outputinfoID = req.params.id;
  if (
    !newOutputInfo.outputinfototalmoney ||
    !newOutputInfo.supplierid ||
    !newOutputInfo.userid
  ) {
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
          message: "Lỗi! Cập nhật phiếu chi không thành công",
        });
      } else {
        res.json({
          error: false,
          statusCode: 1,
          message: "Cập nhật phiếu chi thành công",
        });
      }
    });
  }
};

// Soft destroy
const destroy = function (req, res) {
  var inputInfoID = req.params.id;
  OutputInfo.getOutputInfoByID(inputInfoID, function (err, inputInfo) {
    if (err || Object.keys(inputInfo).length === 0) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy phiếu chi",
      });
    } else {
      OutputInfo.delete(inputInfoID, function (err, inputInfo) {
        if (err) {
          res.json({
            error: true,
            statusCode: 0,
            message: "Lỗi! Xóa phiếu chi không thành công",
          });
        } else {
          res.json({
            error: false,
            statusCode: 1,
            message: "Xóa phiếu chi thành công",
          });
        }
      });
    }
  });
};

// Restore inputInfo
const restore = function (req, res) {
  var inputInfoID = req.params.id;
  OutputInfo.getOutputInfoByID(inputInfoID, function (err, inputInfo) {
    if (err || Object.keys(inputInfo).length === 0) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy phiếu chi",
      });
    } else {
      OutputInfo.restore(inputInfoID, function (err, inputInfo) {
        if (err) {
          res.json({
            error: true,
            statusCode: 0,
            message: "Lỗi! Khôi phục phiếu chi không thành công",
          });
        } else {
          res.json({
            error: false,
            statusCode: 1,
            message: "Khôi phục phiếu chi thành công",
          });
        }
      });
    }
  });
};

module.exports = {
  allOutputInfo,
  getOutputInfoByID,
  search,
  store,
  update,
  destroy,
  restore,
};
