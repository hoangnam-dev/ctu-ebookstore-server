const InputInfo = require("../models/InputInfo");

// Handle result
function handleResult(arrData) {
  var resData = arrData.map((data) => {
    // Handle supplier list of the inputinfo
    var ebooks = data.ebookList.map((d) => {
      return {
        ebookID: d.ebookid,
        ebookName: d.ebookname,
        ebookPrice: d.ebookprice,
        inputPrice: d.input_price,
      };
    });
    // Handle user list of the inputinfo
    var user = data.userList.map((d) => {
      return {
        userID: d.userid,
        userName: d.username,
      };
    });
    // Handle outputinfo list of the inputinfo
    var outputinfo = data.outputinfoList.map((d) => {
      return {
        outputinfoID: d.outputinfoid,
        outputinfoTotalMoney: d.outputinfototalmoney,
        outputinfoDescription: d.outputinfodescription,
        outputinfoCreatedAt: d.outputinfocreatedat,
      };
    });

    // return inputinfo
    return {
      inputinfoID: data.inputinfoid,
      inputinfoTotalMoney: data.inputinfototalmoney,
      inputinfoStatus: data.inputinfostatus,
      inputinfoCreatedAt: data.inputinfocreatedat,
      supplierID: data.supplierid,
      ebookList: ebooks,
      user: user,
      outputinfo: outputinfo,
    };
  });
  return resData;
}

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
      var inputinfoPre = inputinfos.map((inputinfo) => {
        return {
          inputinfoID: inputinfo.inputinfoid,
          inputinfoTotalMoney: inputinfo.inputinfototalmoney,
          inputinfoCreatedAt: inputinfo.inputinfocreatedat,
          outputinfoID: inputinfo.outputinfoid,
          userID: inputinfo.userid,
          supplierID: inputinfo.supplierid,
        };
      });
      res.json(inputinfoPre);
    }
  });
};

// Store new inputinfo
const store = function (req, res) {
  var newInputInfo = new InputInfo(req.body);
  if (
    !newInputInfo.inputinfototalmoney ||
    !newInputInfo.supplierid ||
    !newInputInfo.userid ||
    !newInputInfo.outputinfoid
  ) {
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
          message: "Lỗi! Thêm phiếu nhập không thành công",
        });
      } else {
        InputInfo.storeDetail(inputinfo, req.body.inputDetail, function(err, inputinfo) {
          if (err) {
            res.json({
              error: true,
              statusCode: 0,
              message: "Thêm phiếu nhập không thành công",
            });
          } else {
            res.json({
              error: false,
              statusCode: 1,
              message: "Thêm phiếu nhập thành công",
            });
          }
        })
      }
    });
  }
  
};

// Get inputinfo by ID
const getInputInfoByID = function (req, res) {
  var inputinfoID = req.params.id;
  InputInfo.getInputInfoByID(inputinfoID, function (err, inputinfo) {
    if (err || Object.keys(inputinfo).length === 0) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy phiếu nhập",
      });
    } else {
      var data = handleResult(inputinfo);
      res.json(data);
    }
  });
};

// Search inputinfo
const search = function (req, res) {
  var col = req.query.type;
  var val = req.query.input;
  InputInfo.search(col, val, function (err, inputinfos) {
    if (err || Object.keys(inputinfos).length === 0) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy phiếu nhập",
      });
    } else {
      var inputinfoPre = inputinfos.map((inputinfo) => {
        return {
          inputinfoID: inputinfo.inputinfoid,
          inputinfoTotalMoney: inputinfo.inputinfototalmoney,
          inputinfoCreatedAt: inputinfo.inputinfocreatedat,
          outputinfoID: inputinfo.outputinfoid,
          userID: inputinfo.userid,
          supplierID: inputinfo.supplierid,
        };
      });
      res.json(inputinfoPre);
    }
  });
};

// Store new inputinfo
const update = function (req, res) {
  var newInputInfo = new InputInfo(req.body);
  var inputinfoID = req.params.id;
  if (
    !newInputInfo.inputinfototalmoney ||
    !newInputInfo.supplierid ||
    !newInputInfo.userid ||
    !newInputInfo.outputinfoid
  ) {
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
          message: "Lỗi! Cập nhật phiếu nhập không thành công",
        });
      } else {
        res.json({
          error: false,
          statusCode: 1,
          message: "Cập nhật phiếu nhập thành công",
        });
      }
    });
  }
};

// delete Item
const addDetail = function (req, res) {
  var inputinfoID = req.body.inputinfoID;
  var ebookID = req.body.ebookID;
  var inputPrice = req.body.inputPrice;
  var totalMoney = req.body.totalMoney;
  var ouputinfoID = req.body.ebookID;

  InputInfo.addItemDetail(inputinfoID, ebookID, inputPrice, function (err, inputInfo) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Thêm chi tiết phiếu nhập không thành công",
      });
    } else {
      InputInfo.updateTotalMoney(inputinfoID, totalMoney, ouputinfoID, function (err, inputinfo) {
        if (err) {
          res.json({
            error: true,
            statusCode: 0,
            message: "Lỗi! Cập nhật tổng tiền phiếu nhập không thành công",
          });
        } else {
          res.json({
            error: false,
            statusCode: 1,
            message: "Cập nhật phiếu nhập thành công",
          });
        }
      });
    }
  });
};

// delete Item
const deleteDetail = function (req, res) {
  var inputinfoID = req.body.inputinfoID;
  var ebookID = req.body.ebookID;
  var totalMoney = req.body.totalMoney;
  var ouputinfoID = req.body.ebookID;
  InputInfo.deleteItemDetail(inputinfoID, ebookID, function (err, inputInfo) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Xóa chi tiết phiếu nhập không thành công",
      });
    } else {
      InputInfo.updateTotalMoney(inputinfoID, totalMoney, ouputinfoID, function (err, inputinfo) {
        if (err) {
          res.json({
            error: true,
            statusCode: 0,
            message: "Lỗi! Cập nhật tổng tiền phiếu nhập không thành công",
          });
        } else {
          res.json({
            error: false,
            statusCode: 1,
            message: "Cập nhật phiếu nhập thành công",
          });
        }
      });
    }
  });
};

// Soft destroy
const destroy = function (req, res) {
  var inputInfoID = req.params.id;
  InputInfo.getInputInfoByID(inputInfoID, function (err, inputInfo) {
    if (err || Object.keys(inputInfo).length === 0) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy phiếu nhập",
      });
    } else {
      InputInfo.delete(inputInfoID, function (err, inputInfo) {
        if (err) {
          res.json({
            error: true,
            statusCode: 0,
            message: "Lỗi! Xóa phiếu nhập không thành công",
          });
        } else {
          res.json({
            error: false,
            statusCode: 1,
            message: "Xóa phiếu nhập thành công",
          });
        }
      });
    }
  });
};

// Restore inputInfo
const restore = function (req, res) {
  var inputInfoID = req.params.id;
  InputInfo.getInputInfoByID(inputInfoID, function (err, inputInfo) {
    if (err || Object.keys(inputInfo).length === 0) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy phiếu nhập",
      });
    } else {
      InputInfo.restore(inputInfoID, function (err, inputInfo) {
        if (err) {
          res.json({
            error: true,
            statusCode: 0,
            message: "Lỗi! Khôi phục phiếu nhập không thành công",
          });
        } else {
          res.json({
            error: false,
            statusCode: 1,
            message: "Khôi phục phiếu nhập thành công",
          });
        }
      });
    }
  });
};

module.exports = {
  allInputInfo,
  getInputInfoByID,
  search,
  store,
  update,
  addDetail,
  deleteDetail,
  destroy,
  restore,
};
