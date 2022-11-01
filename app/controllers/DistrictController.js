const District = require("../models/District");

// Show all district
const allDistrict = function (req, res) {
  District.getAll(function (err, districts) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không truy xuất được dữ liệu",
      });
    } else {
      var districtPre = districts.map((district) => {
        return {
          districtID: district.districtid,
          districtName: district.districtname,
          districtType: district.districttype,
          provinceID: district.provinceid,
        };
      });
      res.json(districtPre);
    }
  });
};

// Store new district
const store = function (req, res) {
  var newDistrict = new District(req.body);
  if (!newDistrict.districtname) {
    res.json({
      error: true,
      statusCode: 0,
      message: "Tên quận/huyện không được để trống",
    });
  } else {
    District.store(newDistrict, function (err, district) {
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

// Get district by ID
const getDistrictByID = function (req, res) {
  var districtID = req.params.id;
  District.getDistrictByID(districtID, function (err, district) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy quận/huyện",
      });
    } else {
      var districtPre = district.map((district) => {
        return {
          districtID: district.districtid,
          districtName: district.districtname,
          districtType: district.districttype,
          provinceID: district.provinceid,
        };
      });
      res.json(districtPre);
    }
  })
}

// Get district by ID
const getDistrictByProvinceID = function (req, res) {
  var provinceID = req.body.provinceID;
  District.getDistrictByProvinceID(provinceID, function (err, districts) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy quận/huyện",
      });
    } else {
      var districtPre = districts.map((district) => {
        return {
          districtID: district.districtid,
          districtName: district.districtname,
          districtType: district.districttype,
          provinceID: district.provinceid,
        };
      });
      res.json(districtPre);
    }
  })
}


// Store new district
const update = function (req, res) {
  var newDistrict = new District(req.body);
  var districtID = req.params.id;
  if (!newDistrict.districtname) {
    res.json({
      error: true,
      statusCode: 0,
      message: "Tên quận/huyện không được để trống",
    });
  } else {
    District.update(districtID, newDistrict, function (err, district) {
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
    allDistrict,
    getDistrictByID,
    getDistrictByProvinceID,
    store,
    update,
    // destroy,
}