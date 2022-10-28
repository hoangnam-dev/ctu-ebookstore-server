const License = require("../models/License");

// Show all license
const allLicense = function (req, res) {
  License.getAll(function (err, licenses) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không truy xuất được dữ liệu",
      });
    } else {
      res.json(licenses);
    }
  });
};

// Store new license
const store = function (req, res) {
  var newLicense = new License(req.body);
  if (!newLicense.licenseisrent || !newLicense.licenseexpires || !newLicense.ebookID || !newLicense.customerid) {
    res.json({
      error: true,
      statusCode: 0,
      message: "Thông tin license không được để trống",
    });
  } else {
    License.store(newLicense, function (err, license) {
      if (err) {
        res.json({
          error: true,
          statusCode: 0,
          message: "Lỗi! Thêm license không thành công",
        });
      } else {
        res.json({
          error: false,
          statusCode: 1,
          message: "Thêm license thành công",
        });
      }
    });
  }
};

// Get license by ID
const getLicenseByID = function (req, res) {
  var licenseID = req.params.id;
  License.getLicenseByID(licenseID, function (err, license) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy license",
      });
    } else {
      res.json(license);
    }
  })
}

// Store new license
const update = function (req, res) {
  var newLicense = new License(req.body);
  var licenseID = req.params.id;
  if (!newLicense.licenseisrent || !newLicense.licenseexpires || !newLicense.ebookID || !newLicense.customerid) {
    res.json({
      error: true,
      statusCode: 0,
      message: "Thông tin license không được để trống",
    });
  } else {
    License.update(licenseID, newLicense, function (err, license) {
      if (err) {
        res.json({
          error: true,
          statusCode: 0,
          message: "Lỗi! Cập nhật license không thành công",
        });
      } else {
        res.json({
          error: false,
          statusCode: 1,
          message: "Cập nhật license thành công",
        });
      }
    });
  }
};

module.exports = {
    allLicense,
    getLicenseByID,
    store,
    update,
    // destroy,
}