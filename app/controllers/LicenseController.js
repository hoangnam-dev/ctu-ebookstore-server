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
      var resData = licenses.map((data) => {
        var ebookInfo = data.ebook;
        var customerInfo = data.customer;
        // return licede
        return {
          licenseCode: data.licensecode,
          licenseStatus: data.licensestatus,
          licenseIsRent: data.licenseisrent,
          licenseExpires: data.licenseexpires,
          licenseCreatedAt: data.licensecreatedat,
          ebook: {
            ebookID: ebookInfo.ebookid,
            ebookName: ebookInfo.ebookname,
            ebookAvatar: ebookInfo.ebookavatar,
          },
          customer: {
            customerID: customerInfo.customerid,
            customerName: customerInfo.customername,
          }
        };
      });
      res.json(resData);
    }
  });
};

// Store new license
const store = function (req, res) {
  var newLicense = new License(req.body);
  if (!newLicense.ebookID || !newLicense.customerid) {
    res.json({
      error: true,
      statusCode: 0,
      message: "Thông tin license không được để trống",
    });
  } else {
    License.store(newLicenses, function (err, license) {
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

// Delete License
const destroy = function (req, res) {
  var licenseCode = req.body.licenseCode;
  console.log(licenseCode);
  License.getLicenseByID(licenseCode, function (err, license) {
    if (err || Object.keys(license).length === 0) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy license",
      });
    } else {
      License.delete(licenseCode, function (err, license) {
        if (err) {
          res.json({
            error: true,
            statusCode: 0,
            message: "Lỗi! Xóa license không thành công",
          });
        } else {
          res.json({
            error: false,
            statusCode: 1,
            message: "Xóa license thành công",
          });
        }
      });
    }
  });
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
      var resData = license.map((data) => {
        var ebookInfo = data.ebook;
        var customerInfo = data.customer;
        // return licede
        return {
          licenseCode: data.licensecode,
          licenseStatus: data.licensestatus,
          licenseIsRent: data.licenseisrent,
          licenseExpires: data.licenseexpires,
          licenseCreatedAt: data.licensecreatedat,
          ebook: {
            ebookID: ebookInfo.ebookid,
            ebookName: ebookInfo.ebookname,
            ebookAvatar: ebookInfo.ebookavatar,
          },
          customer: {
            customerID: customerInfo.customerid,
            customerName: customerInfo.customername,
          }
        };
      });
      res.json(resData);
    }
  })
}


module.exports = {
    allLicense,
    getLicenseByID,
    store,
    destroy,
}