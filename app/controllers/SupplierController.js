const Supplier = require("../models/Supplier");

// Show all supplier
const allSupplier = function (req, res) {
  Supplier.getAll(function (err, suppliers) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không truy xuất được dữ liệu",
      });
    } else {
      res.json(suppliers);
    }
  });
};

// Store new supplier
const store = function (req, res) {
  var newSupplier = new Supplier(req.body);
  if (!newSupplier.suppliername || !newSupplier.supplieraddress || !newSupplier.supplierphone || !newSupplier.supplieremail || !newSupplier.supplierbanknumber || !newSupplier.wardid) {
    res.json({
      error: true,
      statusCode: 0,
      message: "Thông tin nhà cung cấp không được để trống",
    });
  } else {
    Supplier.store(newSupplier, function (err, supplier) {
      if (err) {
        res.json({
          error: true,
          statusCode: 0,
          message: "Lỗi! Thêm nhà cung cấp không thành công",
        });
      } else {
        res.json({
          error: false,
          statusCode: 1,
          message: "Thêm nhà cung cấp thành công",
        });
      }
    });
  }
};

// Get supplier by ID
const getSupplierByID = function (req, res) {
  var supplierID = req.params.id;
  Supplier.getSupplierByID(supplierID, function (err, supplier) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy nhà cung cấp",
      });
    } else {
      res.json(supplier);
    }
  })
}

// Store new supplier
const update = function (req, res) {
  var newSupplier = new Supplier(req.body);
  var supplierID = req.params.id;
  if (!newSupplier.suppliername || !newSupplier.supplieraddress || !newSupplier.supplierphone || !newSupplier.supplieremail || !newSupplier.supplierbanknumber || !newSupplier.wardid) {
    res.json({
      error: true,
      statusCode: 0,
      message: "Thông tin nhà cung cấp không được để trống",
    });
  } else {
    Supplier.update(supplierID, newSupplier, function (err, supplier) {
      if (err) {
        res.json({
          error: true,
          statusCode: 0,
          message: "Lỗi! Cập nhật nhà cung cấp không thành công",
        });
      } else {
        res.json({
          error: false,
          statusCode: 1,
          message: "Cập nhật nhà cung cấp thành công",
        });
      }
    });
  }
};

module.exports = {
    allSupplier,
    getSupplierByID,
    store,
    update,
    // destroy,
}