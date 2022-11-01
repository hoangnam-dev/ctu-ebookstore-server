const Province = require("../models/Province");

// Show all province
const allProvince = function (req, res) {
  Province.getAll(function (err, provinces) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không truy xuất được dữ liệu",
      });
    } else {
      var provincePre = provinces.map((province) => {
        return {
          provinceID: province.provinceid,
          provinceName: province.provincename,
          provinceType: province.provincetype,
          provinceID: province.provinceid,
        };
      });
      res.json(provincePre);
    }
  });
};

// Store new province
const store = function (req, res) {
  var newProvince = new Province(req.body);
  if (!newProvince.provincename) {
    res.json({
      error: true,
      statusCode: 0,
      message: "Tên tỉnh/thành phố không được để trống",
    });
  } else {
    Province.store(newProvince, function (err, province) {
      if (err) {
        res.json({
          error: true,
          statusCode: 0,
          message: "Lỗi! Thêm tỉnh/thành phố không thành công",
        });
      } else {
        res.json({
          error: false,
          statusCode: 1,
          message: "Thêm tỉnh/thành phố thành công",
        });
      }
    });
  }
};

// Get province by ID
const getProvinceByID = function (req, res) {
  var provinceID = req.params.id;
  Province.getProvinceByID(provinceID, function (err, province) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy tỉnh/thành phố",
      });
    } else {
      var provincePre = provinces.map((province) => {
        return {
          provinceID: province.provinceid,
          provinceName: province.provincename,
          provinceType: province.provincetype,
          provinceID: province.provinceid,
        };
      });
      res.json(provincePre);
    }
  })
}

// Store new province
const update = function (req, res) {
  var newProvince = new Province(req.body);
  var provinceID = req.params.id;
  if (!newProvince.provincename) {
    res.json({
      error: true,
      statusCode: 0,
      message: "Tên tỉnh/thành phố không được để trống",
    });
  } else {
    Province.update(provinceID, newProvince, function (err, province) {
      if (err) {
        res.json({
          error: true,
          statusCode: 0,
          message: "Lỗi! Cập nhật tỉnh/thành phố không thành công",
        });
      } else {
        res.json({
          error: false,
          statusCode: 1,
          message: "Cập nhật tỉnh/thành phố thành công",
        });
      }
    });
  }
};

module.exports = {
    allProvince,
    getProvinceByID,
    store,
    update,
    // destroy,
}