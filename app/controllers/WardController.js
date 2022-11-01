const Ward = require("../models/Ward");

// Show all ward
const allWard = function (req, res) {
  Ward.getAll(function (err, wards) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không truy xuất được dữ liệu",
      });
    } else {
      var wardPre = wards.map((ward) => {
        return {
          wardID: ward.wardid,
          wardName: ward.wardname,
          wardType: ward.wardtype,
          districtID: ward.districtid,
        };
      });
      res.json(wardPre);
    }
  });
};

// Store new ward
const store = function (req, res) {
  var newWard = new Ward(req.body);
  if (!newWard.wardname || !newWard.districtid) {
    res.json({
      error: true,
      statusCode: 0,
      message: "Tên phường/xã không được để trống",
    });
  } else {
    Ward.store(newWard, function (err, ward) {
      if (err) {
        res.json({
          error: true,
          statusCode: 0,
          message: "Lỗi! Thêm phường/xã không thành công",
        });
      } else {
        res.json({
          error: false,
          statusCode: 1,
          message: "Thêm phường/xã thành công",
        });
      }
    });
  }
};

// Get ward by ID
const getWardByDistrictID = function (req, res) {
  var districtID = req.body.districtID;;
  Ward.getWardByDistrictID(districtID, function (err, wards) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy phường/xã",
      });
    } else {
      var wardPre = wards.map((ward) => {
        return {
          wardID: ward.wardid,
          wardName: ward.wardname,
          wardType: ward.wardtype,
          districtID: ward.districtid,
        };
      });
      res.json(wardPre);
    }
  })
}

// Get ward by ID
const getWardByID = function (req, res) {
  var wardID = req.params.id;
  Ward.getWardByID(wardID, function (err, ward) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy phường/xã",
      });
    } else {
      var wardPre = wards.map((ward) => {
        return {
          wardID: ward.wardid,
          wardName: ward.wardname,
          wardType: ward.wardtype,
          wardID: ward.wardid,
        };
      });
      res.json(wardPre);
    }
  })
}

// Store new ward
const update = function (req, res) {
  var newWard = new Ward(req.body);
  var wardID = req.params.id;
  if (!newWard.wardname) {
    res.json({
      error: true,
      statusCode: 0,
      message: "Tên phường/xã không được để trống",
    });
  } else {
    Ward.update(wardID, newWard, function (err, ward) {
      if (err) {
        res.json({
          error: true,
          statusCode: 0,
          message: "Lỗi! Cập nhật phường/xã không thành công",
        });
      } else {
        res.json({
          error: false,
          statusCode: 1,
          message: "Cập nhật phường/xã thành công",
        });
      }
    });
  }
};

module.exports = {
    allWard,
    getWardByID,
    getWardByDistrictID,
    store,
    update,
    // destroy,
}